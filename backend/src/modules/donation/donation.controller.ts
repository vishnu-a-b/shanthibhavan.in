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
import emailService from '../../services/email.service.js';
import whatsappHelper from '../../services/whatsapp.service.js';
import { saveReceiptToFile, buildReceiptBuffer } from '../../services/receipt-pdf.service.js';

/**
 * Initiate donation payment - Razorpay
 * Step 1: Create donation record
 * Step 2: Call Razorpay Create Order API
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

    const maxAmount = process.env.MAX_DONATION_AMOUNT ? parseInt(process.env.MAX_DONATION_AMOUNT) : 10000000;
    if (amount > maxAmount) {
      res.status(400).json({
        success: false,
        error: `Amount cannot exceed ₹${maxAmount.toLocaleString('en-IN')}`
      });
      return;
    }

    // Idempotency: same email + amount + donationType within 60 seconds → reuse pending donation
    const sixtySecondsAgo = new Date(Date.now() - 60000);
    const recentDonation = await Donation.findOne({
      email: (email as string).toLowerCase(),
      amount,
      donationType,
      paymentStatus: PaymentStatus.PENDING,
      isOffline: false,
      createdAt: { $gte: sixtySecondsAgo }
    });
    if (recentDonation && recentDonation.razorpayOrderId) {
      const razorpayConfig = getRazorpayConfig();
      res.json({
        success: true,
        donationId: recentDonation._id,
        orderId: recentDonation.gatewayOrderId,
        razorpayOrderId: recentDonation.razorpayOrderId,
        razorpayKeyId: razorpayConfig.keyId,
        amount: recentDonation.amount * 100,
        message: 'Existing pending donation reused.'
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
    donation.razorpayOrderId = orderResult.order.id;
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
      orderId: gatewayOrderId,
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

      // Send fellowship payment receipt via WhatsApp
      if (donation.phone) {
        whatsappHelper.sendFellowshipPaymentReceipt(
          donation.phone,
          donation.donorName,
          `₹${donation.amount.toLocaleString('en-IN')}`
        ).catch(err => console.error('Failed to send fellowship WhatsApp receipt:', err));
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
      orderId: donation.gatewayOrderId,
      gatewayTransactionId: razorpay_payment_id,
      checksumVerified: true,
      success: true,
      ipAddress: req.ip,
    });

    // Send success email with receipt PDF attached
    (async () => {
      let receiptPdf: Buffer | undefined;
      if (donation.receiptNumber) {
        try {
          receiptPdf = await buildReceiptBuffer({
            name: donation.donorName,
            amount: donation.amount,
            date: new Date(donation.createdAt).toLocaleDateString('en-IN'),
            phoneNo: donation.phone || '',
            address: donation.address || '',
            transactionNumber: razorpay_payment_id,
            receiptNumber: donation.receiptNumber,
          });
        } catch { /* pdf error is non-fatal */ }
      }
      emailService.sendDonationSuccess({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        transactionId: razorpay_payment_id,
        donationType: donation.donationType,
        receiptNumber: donation.receiptNumber,
        paymentMethod: 'razorpay',
        receiptPdf,
      }).catch(err => console.error('Failed to send success email:', err));
    })();

    res.json({
      success: true,
      donationId: donation._id,
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
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = {};

    if (status) filter.paymentStatus = status;
    if (donationType) filter.donationType = donationType;
    if (isOffline !== undefined) filter.isOffline = isOffline === 'true';
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { donorName: searchRegex },
        { email: searchRegex },
      ];
    }

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

/**
 * Get or generate receipt for a donation.
 * If already generated, returns the stored URL.
 * If not, generates the PDF, saves to public/receipts/, and updates the donation.
 */
export const getOrGenerateReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) {
      res.status(404).json({ success: false, error: 'Donation not found' });
      return;
    }

    if (donation.paymentStatus !== PaymentStatus.SUCCESS) {
      res.status(400).json({ success: false, error: 'Receipt is only available for successful donations' });
      return;
    }

    if (!donation.receiptNumber) {
      res.status(400).json({ success: false, error: 'Receipt number not generated yet' });
      return;
    }

    // Return existing URL if already generated
    if (donation.receiptGenerated && donation.receiptUrl) {
      res.json({ success: true, receiptUrl: donation.receiptUrl });
      return;
    }

    // Generate and save PDF
    const receiptUrl = await saveReceiptToFile({
      name: donation.donorName,
      amount: donation.amount,
      date: new Date(donation.createdAt).toLocaleDateString('en-IN'),
      phoneNo: donation.phone || '',
      address: donation.address || '',
      transactionNumber: donation.transactionId || donation.gatewayOrderId || 'N/A',
      receiptNumber: donation.receiptNumber,
    });

    // Persist URL to donation record
    donation.receiptUrl = receiptUrl;
    donation.receiptGenerated = true;
    await donation.save();

    res.json({ success: true, receiptUrl });
  } catch (error) {
    console.error('Get/generate receipt error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate receipt' });
  }
};

/**
 * Public: Download receipt PDF by receipt number (no auth required).
 * Receipt number is a hard-to-guess random string, safe to expose publicly.
 */
export const downloadReceiptPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiptNumber } = req.params;

    const donation = await Donation.findOne({ receiptNumber });
    if (!donation || donation.paymentStatus !== PaymentStatus.SUCCESS) {
      res.status(404).json({ success: false, error: 'Receipt not found' });
      return;
    }

    const buffer = await buildReceiptBuffer({
      name: donation.donorName,
      amount: donation.amount,
      date: new Date(donation.createdAt).toLocaleDateString('en-IN'),
      phoneNo: donation.phone || '',
      address: donation.address || '',
      transactionNumber: donation.transactionId || donation.gatewayOrderId || 'N/A',
      receiptNumber: donation.receiptNumber!,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${receiptNumber}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.end(buffer);
  } catch (error) {
    console.error('Public receipt download error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate receipt' });
  }
};
