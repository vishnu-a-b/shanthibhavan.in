export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
}

export const getRazorpayConfig = (): RazorpayConfig => {
  const config: RazorpayConfig = {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  };

  if (!config.keyId || !config.keySecret) {
    console.warn('⚠️  Razorpay configuration incomplete. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
  }

  return config;
};

export default getRazorpayConfig;
