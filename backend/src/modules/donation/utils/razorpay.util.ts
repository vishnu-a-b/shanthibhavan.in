import crypto from 'crypto';
import { getRazorpayConfig } from '../../../config/razorpay.js';

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Create a Razorpay order via their REST API
 */
export const createRazorpayOrder = async (
  amount: number,
  receipt: string,
  notes: Record<string, string> = {}
): Promise<{ success: boolean; order?: RazorpayOrder; error?: string }> => {
  const config = getRazorpayConfig();

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt,
        notes,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      const errorMsg = data.error?.description || data.error?.reason || 'Failed to create Razorpay order';
      console.error('Razorpay create order failed:', data);
      return { success: false, error: errorMsg };
    }

    console.log('Razorpay order created:', { id: data.id, amount: data.amount, receipt: data.receipt });
    return { success: true, order: data as RazorpayOrder };
  } catch (error) {
    console.error('Razorpay createOrder error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Verify Razorpay payment signature using HMAC SHA256
 */
export const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean => {
  const config = getRazorpayConfig();
  const expectedSignature = crypto
    .createHmac('sha256', config.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  return expectedSignature === razorpaySignature;
};

/**
 * Generate unique order/receipt ID
 * Format: DN-YYYYMMDDHHMMSS-RANDOM
 */
export const generateOrderId = (): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DN${timestamp}${random}`;
};
