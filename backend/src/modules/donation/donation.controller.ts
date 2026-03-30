import { Request, Response } from 'express';
import Donation, { DonationType, PaymentStatus } from './donation.model.js';
import Transaction, { TransactionType } from './transaction.model.js';
import Fellowship from '../fellowship/fellowship.model.js';
import Campaign, { CampaignStatus } from '../campaign/campaign.model.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  generateOrderId,
} from './utils/razorpay.util.js';
import getRazorpayConfig from '../../config/razorpay.js';
import {
  parseCallbackResponse,
  retrieveTransaction,
  isPaymentSuccessful,
  isPaymentPending,
  isPaymentFailed,
  getPaymentStatusMessage,
  isTerminalCancellation,
} from './utils/billdesk.util.js';
import emailService from '../../services/email.service.js';

/**
 * Initiate donation payment - BillDesk V2
 * Step 1: Create donation record
 * Step 2: Call BillDesk Create Order API
 * Step 3: Return payment page redirect data
 */
export const initiateDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      donorName,
      email,
      phone,
      amount,
      donationType = DonationType.GENERAL,
      panNumber,
      address,
      notes,
      fellowshipId,
      campaignId
    } = req.body;

    // Validation
    if (!donorName || !email || !amount) {
      res.status(400).json({
        success: false,
        error: 'Required fields: donorName, email, amount'
      });
      return;
    }

    if (amount < 1) {
      res.status(400).json({
        success: false,
        error: 'Amount must be at least 1'
      });
      return;
    }

    // If fellowship donation, validate fellowship exists
    if (fellowshipId) {
      const fellowship = await Fellowship.findById(fellowshipId);
      if (!fellowship) {
        res.status(404).json({
          success: false,
          error: 'Fellowship not found'
        });
        return;
      }

      // Check if already paid this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastPaymentThisMonth = fellowship.lastPaymentDate &&
        fellowship.lastPaymentDate >= firstDayOfMonth;

      if (lastPaymentThisMonth) {
        res.status(400).json({
          success: false,
          error: 'Payment already made for this month'
        });
        return;
      }
    }

    // If campaign donation, validate campaign exists and is active
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      if (campaign.status !== CampaignStatus.ACTIVE) {
        res.status(400).json({
          success: false,
          error: 'This campaign is not currently active'
        });
        return;
      }
    }

    // Generate unique order ID
    const gatewayOrderId = generateOrderId();

    // Create donation record with PENDING status
    const donation = await Donation.create({
      donorName,
      email,
      phone,
      panNumber,
      address,
      amount,
      donationType,
      notes,
      gatewayOrderId,
      fellowshipId,
      campaignId,
      paymentStatus: PaymentStatus.PENDING
    });

    // Create Razorpay order
    const orderResult = await createRazorpayOrder(amount, gatewayOrderId, {
      donationType,
      donationId: donation._id.toString(),
      donorName,
      email,
    });

    if (!orderResult.success || !orderResult.order) {
      // Update donation as failed
      donation.paymentStatus = PaymentStatus.FAILED;
      donation.gatewayResponse = orderResult.error || 'Order creation failed';
      await donation.save();

      res.status(500).json({
        success: false,
        error: orderResult.error || 'Failed to create payment order'
      });
      return;
    }

    // Store Razorpay order ID
    donation.bdOrderId = orderResult.order.id; // reuse field for Razorpay order ID
    await donation.save();

    // Log transaction
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.PAYMENT_INITIATED,
      requestPayload: {
        orderId: gatewayOrderId,
        razorpayOrderId: orderResult.order.id,
        amount,
        donorName,
        email
      },
      responsePayload: orderResult.order,
      bdOrderId: gatewayOrderId,
      success: true
    });

    const razorpayConfig = getRazorpayConfig();

    res.json({
      success: true,
      donationId: donation._id,
      orderId: gatewayOrderId,
      razorpayOrderId: orderResult.order.id,
      razorpayKeyId: razorpayConfig.keyId,
      amount: orderResult.order.amount, // in paise
      message: 'Donation initiated. Open Razorpay checkout.'
    });
  } catch (error) {
    console.error('Initiate donation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate donation'
    });
  }
};

/**
 * Verify Razorpay payment signature and mark donation as SUCCESS
 */
export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, donationId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !donationId) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    // Verify HMAC signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      res.status(400).json({ success: false, error: 'Invalid payment signature' });
      return;
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      res.status(404).json({ success: false, error: 'Donation not found' });
      return;
    }

    // Idempotent — already processed
    if (donation.paymentStatus === PaymentStatus.SUCCESS) {
      res.json({ success: true, receiptNumber: donation.receiptNumber, orderId: donation.gatewayOrderId });
      return;
    }

    // Update donation
    donation.transactionId = razorpay_payment_id;
    donation.authStatus = 'SUCCESS';
    donation.gatewayResponse = JSON.stringify({ razorpay_payment_id, razorpay_order_id });
    donation.checksumVerified = true;
    donation.paymentStatus = PaymentStatus.SUCCESS;

    // Update fellowship if applicable
    if (donation.fellowshipId) {
      const fellowship = await Fellowship.findById(donation.fellowshipId);
      if (fellowship) {
        fellowship.lastPaymentDate = new Date();
        fellowship.totalPaid += donation.amount;
        fellowship.totalPayments += 1;
        fellowship.donations.push(donation._id);
        await fellowship.save();
      }
    }

    // Update campaign if applicable
    if (donation.campaignId) {
      const campaign = await Campaign.findById(donation.campaignId);
      if (campaign) {
        campaign.raisedAmount += donation.amount;
        campaign.donorCount += 1;
        campaign.donations.push(donation._id);
        await campaign.save();
      }
    }

    await donation.save();

    // Log transaction
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.PAYMENT_RETURN,
      responsePayload: { razorpay_payment_id, razorpay_order_id },
      bdOrderId: donation.gatewayOrderId,
      bdTransactionId: razorpay_payment_id,
      checksumVerified: true,
      success: true,
      ipAddress: req.ip,
    });

    // Send success email
    emailService.sendDonationSuccess({
      email: donation.email,
      donorName: donation.donorName,
      amount: donation.amount,
      currency: donation.currency,
      transactionId: razorpay_payment_id,
      donationType: donation.donationType,
      receiptNumber: donation.receiptNumber,
      paymentMethod: 'razorpay',
    }).catch(err => console.error('Failed to send success email:', err));

    res.json({
      success: true,
      receiptNumber: donation.receiptNumber,
      orderId: donation.gatewayOrderId,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
};

/**
 * Handle Razorpay payment failure (called from frontend)
 */
export const handleRazorpayFailure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donationId, error } = req.body;

    if (donationId) {
      const donation = await Donation.findById(donationId);
      if (donation && donation.paymentStatus === PaymentStatus.PENDING) {
        donation.paymentStatus = PaymentStatus.FAILED;
        donation.authStatus = 'FAILED';
        donation.gatewayResponse = JSON.stringify(error || 'Payment failed');
        await donation.save();

        emailService.sendDonationFailed({
          email: donation.email,
          donorName: donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          reason: (error as any)?.description || 'Payment failed',
        }).catch(err => console.error('Failed to send failure email:', err));
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Handle Razorpay failure error:', err);
    res.status(500).json({ success: false, error: 'Failed to process' });
  }
};

/**
 * Handle BillDesk return callback (kept for backward compatibility)
 */
export const handleBillDeskReturn = async (req: Request, res: Response): Promise<void> => {
  // Strip trailing slash and /donate path to avoid double /donate/donate/
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/donate\/?$/, '').replace(/\/$/, '');

  try {
    // Merge body and query so handler works for both GET and POST callbacks
    const callbackData = { ...req.query, ...req.body };

    console.log('BillDesk return callback received:', {
      method: req.method,
      queryKeys: Object.keys(req.query),
      bodyKeys: Object.keys(req.body),
      callbackDataKeys: Object.keys(callbackData),
      contentType: req.headers['content-type'],
    });

    // Check for BillDesk error response (plain error fields alongside encrypted_response)
    if (callbackData.error_code && callbackData.error_type) {
      const errorMsg = (callbackData.message as string) || `Payment error: ${callbackData.error_code}`;
      console.error('BillDesk callback error:', {
        error_type: callbackData.error_type,
        error_code: callbackData.error_code,
        message: callbackData.message,
        status: callbackData.status,
      });

      // Try to decrypt encrypted_response to get order details for DB update
      if (callbackData.encrypted_response) {
        try {
          const validation = await parseCallbackResponse(callbackData.encrypted_response as string);
          if (validation.response?.orderid) {
            const donation = await Donation.findOne({ gatewayOrderId: validation.response.orderid });
            if (donation && donation.paymentStatus === PaymentStatus.PENDING) {
              donation.paymentStatus = PaymentStatus.FAILED;
              donation.authStatus = 'ERROR';
              donation.gatewayResponse = JSON.stringify({ error_code: callbackData.error_code, message: callbackData.message });
              await donation.save();
            }
            res.redirect(`${frontendUrl}/donate/failed?orderId=${validation.response.orderid}&message=${encodeURIComponent(errorMsg)}`);
            return;
          }
        } catch {
          // Could not decrypt, continue with generic error
        }
      }

      res.redirect(`${frontendUrl}/donate/failed?message=${encodeURIComponent(errorMsg)}`);
      return;
    }

    // Check for terminal cancellation (user clicked X button)
    if (isTerminalCancellation(callbackData)) {
      const orderId = callbackData.orderid as string;

      if (orderId) {
        const donation = await Donation.findOne({ gatewayOrderId: orderId });
        if (donation && donation.paymentStatus === PaymentStatus.PENDING) {
          donation.paymentStatus = PaymentStatus.FAILED;
          donation.authStatus = 'CANCELLED';
          donation.gatewayResponse = 'User cancelled payment';
          await donation.save();

          // Log transaction
          await Transaction.create({
            donationId: donation._id,
            transactionType: TransactionType.PAYMENT_RETURN,
            responsePayload: callbackData,
            bdOrderId: orderId,
            success: false,
            ipAddress: req.ip
          });
        }
      }

      res.redirect(`${frontendUrl}/donate/failed?orderId=${orderId}&message=${encodeURIComponent('Payment cancelled')}`);
      return;
    }

    // Get JWS response token
    // BillDesk sends as: encrypted_response, transaction_response, or response
    let responseToken = callbackData.encrypted_response || callbackData.transaction_response || callbackData.response;

    // If body is a raw string (text/plain or application/jose), it's the JOSE token itself
    if (!responseToken && typeof req.body === 'string' && req.body.length > 0) {
      responseToken = req.body;
    }

    if (!responseToken) {
      console.error('No response token received:', { callbackData, rawBody: typeof req.body, bodyLength: typeof req.body === 'string' ? req.body.length : 0 });
      res.redirect(`${frontendUrl}/donate/failed?message=${encodeURIComponent('No response received')}`);
      return;
    }

    // Parse and verify JWS response
    const validation = await parseCallbackResponse(responseToken);

    if (!validation.isValid || !validation.response) {
      console.error('Invalid response:', validation.error);
      res.redirect(`${frontendUrl}/donate/failed?message=${encodeURIComponent(validation.error || 'Invalid response')}`);
      return;
    }

    const { response, checksumVerified } = validation;

    // Find donation by order ID
    const donation = await Donation.findOne({ gatewayOrderId: response.orderid });

    if (!donation) {
      console.error('Donation not found for order:', response.orderid);
      res.redirect(`${frontendUrl}/donate/failed?message=${encodeURIComponent('Donation not found')}`);
      return;
    }

    // Update donation with response data
    donation.transactionId = response.transactionid;
    donation.authStatus = response.auth_status;
    donation.bankReferenceNumber = response.bank_ref_no;
    donation.gatewayResponse = JSON.stringify(response);
    donation.encodedResponse = responseToken as string; // Store original encoded response
    donation.checksumVerified = checksumVerified;
    donation.paymentMethod = response.payment_method_type;

    // Handle based on auth status
    if (isPaymentSuccessful(response.auth_status)) {
      donation.paymentStatus = PaymentStatus.SUCCESS;

      // Update fellowship if applicable
      if (donation.fellowshipId) {
        const fellowship = await Fellowship.findById(donation.fellowshipId);
        if (fellowship) {
          fellowship.lastPaymentDate = new Date();
          fellowship.totalPaid += donation.amount;
          fellowship.totalPayments += 1;
          fellowship.donations.push(donation._id);
          await fellowship.save();
        }
      }

      // Update campaign if applicable
      if (donation.campaignId) {
        const campaign = await Campaign.findById(donation.campaignId);
        if (campaign) {
          campaign.raisedAmount += donation.amount;
          campaign.donorCount += 1;
          campaign.donations.push(donation._id);
          await campaign.save();
        }
      }
    } else if (isPaymentPending(response.auth_status)) {
      // Payment pending - keep as pending, will be updated via webhook or retrieve API
      donation.paymentStatus = PaymentStatus.PENDING;
    } else {
      // Payment failed
      donation.paymentStatus = PaymentStatus.FAILED;
    }

    await donation.save();

    // Log transaction
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.PAYMENT_RETURN,
      responsePayload: response,
      bdOrderId: response.orderid,
      bdTransactionId: response.transactionid,
      checksumVerified,
      success: isPaymentSuccessful(response.auth_status),
      ipAddress: req.ip
    });

    // Send email notification
    if (donation.paymentStatus === PaymentStatus.SUCCESS) {
      emailService.sendDonationSuccess({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        transactionId: response.transactionid || donation.gatewayOrderId || 'N/A',
        donationType: donation.donationType,
        receiptNumber: donation.receiptNumber,
        paymentMethod: donation.paymentMethod
      }).catch(err => console.error('Failed to send success email:', err));

      res.redirect(`${frontendUrl}/donate/success?orderId=${response.orderid}&receiptNumber=${donation.receiptNumber}`);
    } else if (donation.paymentStatus === PaymentStatus.PENDING) {
      // Redirect to pending page
      res.redirect(`${frontendUrl}/donate/pending?orderId=${response.orderid}`);
    } else {
      const statusMessage = getPaymentStatusMessage(response.auth_status, response.transaction_error_desc);

      emailService.sendDonationFailed({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        reason: statusMessage
      }).catch(err => console.error('Failed to send failure email:', err));

      res.redirect(`${frontendUrl}/donate/failed?orderId=${response.orderid}&message=${encodeURIComponent(statusMessage)}`);
    }
  } catch (error) {
    console.error('BillDesk return callback error:', error);
    res.redirect(`${frontendUrl}/donate/failed?message=${encodeURIComponent('Processing error')}`);
  }
};

/**
 * Handle BillDesk webhook (server-to-server notification)
 * Step 6: Webhook for transaction response
 */
export const handleBillDeskWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get JWS response token
    const webhookBody = typeof req.body === 'string' ? {} : req.body;
    const responseToken = webhookBody.encrypted_response || webhookBody.transaction_response || webhookBody.response || (typeof req.body === 'string' ? req.body : null);

    if (!responseToken) {
      console.error('Webhook: No response token received:', req.body);
      res.status(400).json({
        success: false,
        error: 'No response data received'
      });
      return;
    }

    // Parse and verify JWS response
    const validation = await parseCallbackResponse(responseToken);

    if (!validation.isValid || !validation.response) {
      console.error('Webhook: Invalid response:', validation.error);
      res.status(400).json({
        success: false,
        error: validation.error || 'Invalid response'
      });
      return;
    }

    const { response, checksumVerified } = validation;

    // Find donation by order ID
    const donation = await Donation.findOne({ gatewayOrderId: response.orderid });

    if (!donation) {
      console.error('Webhook: Donation not found for order:', response.orderid);
      res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
      return;
    }

    // Only process if still pending (idempotent)
    if (donation.paymentStatus === PaymentStatus.PENDING) {
      donation.transactionId = response.transactionid;
      donation.authStatus = response.auth_status;
      donation.bankReferenceNumber = response.bank_ref_no;
      donation.gatewayResponse = JSON.stringify(response);
      donation.checksumVerified = checksumVerified;
      donation.paymentMethod = response.payment_method_type;

      if (isPaymentSuccessful(response.auth_status)) {
        donation.paymentStatus = PaymentStatus.SUCCESS;

        // Update fellowship if applicable
        if (donation.fellowshipId) {
          const fellowship = await Fellowship.findById(donation.fellowshipId);
          if (fellowship && !fellowship.donations.includes(donation._id)) {
            fellowship.lastPaymentDate = new Date();
            fellowship.totalPaid += donation.amount;
            fellowship.totalPayments += 1;
            fellowship.donations.push(donation._id);
            await fellowship.save();
          }
        }

        // Update campaign if applicable
        if (donation.campaignId) {
          const campaign = await Campaign.findById(donation.campaignId);
          if (campaign && !campaign.donations.includes(donation._id)) {
            campaign.raisedAmount += donation.amount;
            campaign.donorCount += 1;
            campaign.donations.push(donation._id);
            await campaign.save();
          }
        }

        // Send success email
        emailService.sendDonationSuccess({
          email: donation.email,
          donorName: donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          transactionId: response.transactionid || donation.gatewayOrderId || 'N/A',
          donationType: donation.donationType,
          receiptNumber: donation.receiptNumber,
          paymentMethod: donation.paymentMethod
        }).catch(err => console.error('Failed to send success email:', err));

      } else if (isPaymentFailed(response.auth_status)) {
        donation.paymentStatus = PaymentStatus.FAILED;

        // Send failure email
        emailService.sendDonationFailed({
          email: donation.email,
          donorName: donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          reason: getPaymentStatusMessage(response.auth_status, response.transaction_error_desc)
        }).catch(err => console.error('Failed to send failure email:', err));
      }
      // If still pending (0002), keep as pending

      await donation.save();
    }

    // Log transaction
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.PAYMENT_WEBHOOK,
      responsePayload: response,
      bdOrderId: response.orderid,
      bdTransactionId: response.transactionid,
      checksumVerified,
      success: isPaymentSuccessful(response.auth_status),
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('BillDesk webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
};

/**
 * Check transaction status - Retrieve Transaction API
 * Step 7: For pending transactions
 */
export const checkTransactionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;

    if (!orderId) {
      res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
      return;
    }

    // Find donation
    const donation = await Donation.findOne({ gatewayOrderId: orderId });

    if (!donation) {
      res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
      return;
    }

    // If already processed, return current status
    if (donation.paymentStatus !== PaymentStatus.PENDING) {
      res.json({
        success: true,
        status: donation.paymentStatus,
        transactionId: donation.transactionId,
        message: getPaymentStatusMessage(donation.authStatus || '')
      });
      return;
    }

    // Call Retrieve Transaction API
    const result = await retrieveTransaction(orderId, donation.bdOrderId);

    if (!result.success || !result.data) {
      res.json({
        success: true,
        status: PaymentStatus.PENDING,
        message: 'Transaction status is still pending. Please try again later.'
      });
      return;
    }

    const txnData = result.data;

    // Update donation based on retrieved status
    donation.transactionId = txnData.transactionid;
    donation.authStatus = txnData.auth_status;
    donation.bankReferenceNumber = txnData.bank_ref_no;
    donation.gatewayResponse = JSON.stringify(txnData);
    donation.paymentMethod = txnData.payment_method_type;

    if (isPaymentSuccessful(txnData.auth_status)) {
      donation.paymentStatus = PaymentStatus.SUCCESS;

      // Update fellowship/campaign
      if (donation.fellowshipId) {
        const fellowship = await Fellowship.findById(donation.fellowshipId);
        if (fellowship && !fellowship.donations.includes(donation._id)) {
          fellowship.lastPaymentDate = new Date();
          fellowship.totalPaid += donation.amount;
          fellowship.totalPayments += 1;
          fellowship.donations.push(donation._id);
          await fellowship.save();
        }
      }

      if (donation.campaignId) {
        const campaign = await Campaign.findById(donation.campaignId);
        if (campaign && !campaign.donations.includes(donation._id)) {
          campaign.raisedAmount += donation.amount;
          campaign.donorCount += 1;
          campaign.donations.push(donation._id);
          await campaign.save();
        }
      }

      // Send success email
      emailService.sendDonationSuccess({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        transactionId: txnData.transactionid || donation.gatewayOrderId || 'N/A',
        donationType: donation.donationType,
        receiptNumber: donation.receiptNumber,
        paymentMethod: donation.paymentMethod
      }).catch(err => console.error('Failed to send success email:', err));

    } else if (isPaymentFailed(txnData.auth_status)) {
      donation.paymentStatus = PaymentStatus.FAILED;

      emailService.sendDonationFailed({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        reason: getPaymentStatusMessage(txnData.auth_status, txnData.transaction_error_desc)
      }).catch(err => console.error('Failed to send failure email:', err));
    }

    await donation.save();

    // Log transaction
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.STATUS_CHECK,
      responsePayload: txnData,
      bdOrderId: txnData.orderid,
      bdTransactionId: txnData.transactionid,
      success: isPaymentSuccessful(txnData.auth_status),
    });

    res.json({
      success: true,
      status: donation.paymentStatus,
      transactionId: donation.transactionId,
      message: getPaymentStatusMessage(txnData.auth_status, txnData.transaction_error_desc)
    });
  } catch (error) {
    console.error('Check transaction status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check transaction status'
    });
  }
};

/**
 * Get donation by ID
 */
export const getDonationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id)
      .populate('addedBy', 'username email')
      .populate('approvedBy', 'username email')
      .populate('fellowshipId', 'subscriberName email');

    if (!donation) {
      res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
      return;
    }

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donation'
    });
  }
};

/**
 * List all donations with filters
 */
export const listDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      donationType,
      isOffline,
      approvalStatus,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = {};

    if (status) filter.paymentStatus = status;
    if (donationType) filter.donationType = donationType;
    if (isOffline !== undefined) filter.isOffline = isOffline === 'true';
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate('addedBy', 'username email')
        .populate('approvedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Donation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      donations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List donations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donations'
    });
  }
};

/**
 * Get donation statistics
 */
export const getDonationStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalDonations,
      successfulDonations,
      totalAmount,
      generalAmount,
      fellowshipAmount,
      campaignAmount
    ] = await Promise.all([
      Donation.countDocuments(),
      Donation.countDocuments({ paymentStatus: PaymentStatus.SUCCESS }),
      Donation.aggregate([
        { $match: { paymentStatus: PaymentStatus.SUCCESS } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
            donationType: DonationType.GENERAL
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
            donationType: DonationType.FELLOWSHIP
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
            donationType: DonationType.CAMPAIGN
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalDonations,
        successfulDonations,
        totalAmount: totalAmount[0]?.total || 0,
        generalAmount: generalAmount[0]?.total || 0,
        fellowshipAmount: fellowshipAmount[0]?.total || 0,
        campaignAmount: campaignAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};
