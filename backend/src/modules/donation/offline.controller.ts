import { Request, Response } from 'express';
import Donation, { DonationType, PaymentStatus, ApprovalStatus } from './donation.model.js';
import Transaction, { TransactionType } from './transaction.model.js';
import Campaign from '../campaign/campaign.model.js';
import emailService from '../../services/email.service.js';
import whatsappHelper from '../../services/whatsapp.service.js';
import { buildReceiptBuffer, saveReceiptToFile } from '../../services/receipt-pdf.service.js';

/**
 * Add offline payment (Agent role)
 */
export const addOfflinePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const {
      donorName,
      email,
      phone,
      amount,
      donationType = DonationType.GENERAL,
      campaignId,
      panNumber,
      address,
      notes,
      offlinePaymentMethod
    } = req.body;

    // Validation
    if (!donorName || !email || !amount || !offlinePaymentMethod) {
      res.status(400).json({
        success: false,
        error: 'Required fields: donorName, email, amount, offlinePaymentMethod'
      });
      return;
    }

    if (phone && !/^[+\d\s\-()\\.]{7,20}$/.test(phone)) {
      res.status(400).json({ success: false, error: 'Invalid phone number format' });
      return;
    }

    if (amount < 1) {
      res.status(400).json({
        success: false,
        error: 'Amount must be at least 1'
      });
      return;
    }

    if (donationType === DonationType.CAMPAIGN) {
      if (!campaignId) {
        res.status(400).json({ success: false, error: 'campaignId is required for campaign donations' });
        return;
      }
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        res.status(404).json({ success: false, error: 'Campaign not found' });
        return;
      }
    }

    // Create offline donation record
    const donation = await Donation.create({
      donorName,
      email,
      phone,
      panNumber,
      address,
      amount,
      donationType,
      ...(campaignId && { campaignId }),
      notes,
      isOffline: true,
      offlinePaymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      approvalStatus: ApprovalStatus.PENDING,
      addedBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      donation,
      message: 'Offline payment added. Pending approval.'
    });
  } catch (error) {
    console.error('Add offline payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add offline payment'
    });
  }
};

/**
 * Get pending approvals (Approver role)
 */
export const getPendingApprovals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pendingDonations = await Donation.find({
      isOffline: true,
      approvalStatus: ApprovalStatus.PENDING
    })
      .populate('addedBy', 'username email')
      .populate('campaignId', 'title slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations: pendingDonations,
      count: pendingDonations.length
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals'
    });
  }
};

/**
 * Approve offline payment (Approver role)
 */
export const approveOfflinePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const donation = await Donation.findOne({
      _id: id,
      isOffline: true,
      approvalStatus: ApprovalStatus.PENDING
    });

    if (!donation) {
      res.status(404).json({
        success: false,
        error: 'Donation not found or already processed'
      });
      return;
    }

    // Update donation
    donation.approvalStatus = ApprovalStatus.APPROVED;
    donation.paymentStatus = PaymentStatus.SUCCESS;
    donation.approvedBy = req.admin._id;
    donation.approvalDate = new Date();

    await donation.save();

    // Update campaign stats if this is a campaign donation
    if (donation.campaignId) {
      await Campaign.findByIdAndUpdate(donation.campaignId, {
        $inc: { raisedAmount: donation.amount, donorCount: 1 },
        $push: { donations: donation._id }
      });
    }

    // Audit log
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.OFFLINE_APPROVED,
      requestPayload: { approvedBy: req.admin._id, approvedAt: new Date() },
      orderId: donation.gatewayOrderId,
      success: true,
      ipAddress: req.ip
    });

    // Generate receipt PDF, save to file, send email + WhatsApp
    (async () => {
      const donationId = donation._id;
      const receiptNumber = donation.receiptNumber;
      console.log(`[Receipt] Starting offline approval receipt delivery for donationId=${donationId}, receiptNumber=${receiptNumber}, phone=${donation.phone}, email=${donation.email}`);

      if (!receiptNumber) {
        console.warn(`[Receipt] No receiptNumber on donation ${donationId} — skipping receipt delivery`);
        return;
      }

      let receiptPdf: Buffer | undefined;

      try {
        const campaignName = donation.campaignId
          ? (await Campaign.findById(donation.campaignId).select('title'))?.title
          : undefined;

        console.log(`[Receipt] Saving receipt PDF to file for receiptNumber=${receiptNumber}`);
        const receiptUrl = await saveReceiptToFile({
          name: donation.donorName,
          amount: donation.amount,
          date: new Date(donation.createdAt).toLocaleDateString('en-IN'),
          phoneNo: donation.phone || '',
          address: donation.address || '',
          email: donation.email,
          transactionNumber: donation.offlinePaymentMethod || 'Offline',
          receiptNumber,
          programName: campaignName,
        });
        console.log(`[Receipt] Receipt saved to: ${receiptUrl}`);

        await Donation.findByIdAndUpdate(donation._id, {
          receiptUrl,
          receiptGenerated: true,
        });

        console.log(`[Receipt] Building PDF buffer for receiptNumber=${receiptNumber}`);
        receiptPdf = await buildReceiptBuffer({
          name: donation.donorName,
          amount: donation.amount,
          date: new Date(donation.createdAt).toLocaleDateString('en-IN'),
          phoneNo: donation.phone || '',
          address: donation.address || '',
          email: donation.email,
          transactionNumber: donation.offlinePaymentMethod || 'Offline',
          receiptNumber,
          programName: campaignName,
        });
        console.log(`[Receipt] PDF buffer built, size=${receiptPdf.length} bytes`);
      } catch (err) {
        console.error(`[Receipt] PDF generation error for donationId=${donationId}:`, err);
      }

      console.log(`[Receipt] Sending approval email to ${donation.email}`);
      emailService.sendOfflineDonationApproved({
        email: donation.email,
        donorName: donation.donorName,
        amount: donation.amount,
        currency: donation.currency,
        receiptNumber,
        receiptPdf,
      }).then(ok => {
        if (ok) console.log(`[Receipt] Approval email sent successfully to ${donation.email}`);
        else console.warn(`[Receipt] Approval email send returned false for ${donation.email}`);
      }).catch(err => console.error(`[Receipt] Approval email failed for ${donation.email}:`, err));

      if (donation.phone && receiptPdf) {
        console.log(`[Receipt] Sending WhatsApp to ${donation.phone}`);
        whatsappHelper.sendDonationReceipt(
          donation.phone,
          receiptPdf,
          `${receiptNumber}.pdf`
        ).then(msgId => console.log(`[Receipt] WhatsApp sent successfully, messageId=${msgId}`))
         .catch(err => console.error(`[Receipt] WhatsApp send failed for ${donation.phone}:`, err));
      } else {
        console.warn(`[Receipt] Skipping WhatsApp — phone=${donation.phone}, hasPdf=${!!receiptPdf}`);
      }
    })();

    res.json({
      success: true,
      donation,
      message: 'Offline payment approved successfully'
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve payment'
    });
  }
};

/**
 * Reject offline payment (Approver role)
 */
export const rejectOfflinePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
      return;
    }

    const donation = await Donation.findOne({
      _id: id,
      isOffline: true,
      approvalStatus: ApprovalStatus.PENDING
    });

    if (!donation) {
      res.status(404).json({
        success: false,
        error: 'Donation not found or already processed'
      });
      return;
    }

    // Update donation
    donation.approvalStatus = ApprovalStatus.REJECTED;
    donation.paymentStatus = PaymentStatus.FAILED;
    donation.approvedBy = req.admin._id;
    donation.approvalDate = new Date();
    donation.rejectionReason = reason;

    await donation.save();

    // Audit log
    await Transaction.create({
      donationId: donation._id,
      transactionType: TransactionType.OFFLINE_REJECTED,
      requestPayload: { rejectedBy: req.admin._id, reason, rejectedAt: new Date() },
      orderId: donation.gatewayOrderId,
      success: false,
      ipAddress: req.ip
    });

    // Send rejection email to donor
    emailService.sendOfflineDonationRejected({
      email: donation.email,
      donorName: donation.donorName,
      amount: donation.amount,
      currency: donation.currency,
      reason
    }).catch(err => console.error('Failed to send rejection email:', err));

    res.json({
      success: true,
      donation,
      message: 'Offline payment rejected'
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject payment'
    });
  }
};

/**
 * Edit a pending offline payment (Agent / Super Admin)
 */
export const editOfflinePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const donation = await Donation.findOne({
      _id: id,
      isOffline: true,
      approvalStatus: ApprovalStatus.PENDING,
    });

    if (!donation) {
      res.status(404).json({ success: false, error: 'Pending offline donation not found' });
      return;
    }

    const allowedFields = ['donorName', 'email', 'phone', 'amount', 'donationType', 'campaignId', 'panNumber', 'address', 'notes', 'offlinePaymentMethod'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (donation as any)[field] = req.body[field];
      }
    }

    await donation.save();

    res.json({ success: true, donation, message: 'Offline payment updated' });
  } catch (error) {
    console.error('Edit offline payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to update offline payment' });
  }
};

/**
 * Delete a pending offline payment (Agent / Super Admin)
 */
export const deleteOfflinePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const donation = await Donation.findOneAndDelete({
      _id: id,
      isOffline: true,
      approvalStatus: ApprovalStatus.PENDING,
    });

    if (!donation) {
      res.status(404).json({ success: false, error: 'Pending offline donation not found or already processed' });
      return;
    }

    res.json({ success: true, message: 'Offline payment deleted' });
  } catch (error) {
    console.error('Delete offline payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete offline payment' });
  }
};

/**
 * Get offline payment history
 */
export const getOfflinePaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      approvalStatus,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = { isOffline: true };

    if (approvalStatus) {
      filter.approvalStatus = approvalStatus;
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
    console.error('Get offline payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offline payment history'
    });
  }
};
