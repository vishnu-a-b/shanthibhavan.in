import express, { Router } from 'express';
import {
  initiateDonation,
  verifyRazorpayPayment,
  handleRazorpayFailure,
  getDonationById,
  listDonations,
  getDonationStats,
  getOrGenerateReceipt,
  downloadReceiptPublic
} from './donation.controller.js';
import {
  addOfflinePayment,
  getPendingApprovals,
  approveOfflinePayment,
  rejectOfflinePayment,
  getOfflinePaymentHistory,
  editOfflinePayment,
  deleteOfflinePayment,
} from './offline.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js';
import { AdminRole } from '../admin/admin.model.js';

const router: Router = express.Router();

// Public routes
router.post('/initiate', initiateDonation);
router.post('/verify-razorpay', verifyRazorpayPayment);
router.post('/razorpay-failure', handleRazorpayFailure);
router.get('/receipt/download/:receiptNumber', downloadReceiptPublic);

// Offline payment routes (must be before /:id to avoid route conflicts)
router.post('/offline',
  requireAuth,
  requireRole(AdminRole.AGENT, AdminRole.SUPER_ADMIN),
  addOfflinePayment
);

router.get('/pending-approvals',
  requireAuth,
  requireRole(AdminRole.APPROVER, AdminRole.SUPER_ADMIN),
  getPendingApprovals
);

router.get('/offline/history',
  requireAuth,
  requireRole(AdminRole.ACCOUNTS, AdminRole.SUPER_ADMIN),
  getOfflinePaymentHistory
);

// Protected routes - require authentication
router.get('/stats', requireAuth, getDonationStats);
router.get('/', requireAuth, listDonations);
router.get('/:id/receipt', requireAuth, getOrGenerateReceipt);
router.get('/:id', requireAuth, getDonationById);

// Donation actions (must be after specific routes)
router.put('/:id/approve',
  requireAuth,
  requireRole(AdminRole.APPROVER, AdminRole.SUPER_ADMIN),
  approveOfflinePayment
);

router.put('/:id/reject',
  requireAuth,
  requireRole(AdminRole.APPROVER, AdminRole.SUPER_ADMIN),
  rejectOfflinePayment
);

router.put('/:id/offline',
  requireAuth,
  requireRole(AdminRole.AGENT, AdminRole.SUPER_ADMIN),
  editOfflinePayment
);

router.delete('/:id/offline',
  requireAuth,
  requireRole(AdminRole.AGENT, AdminRole.SUPER_ADMIN),
  deleteOfflinePayment
);

export default router;
