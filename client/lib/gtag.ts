export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string;

declare global {
  interface Window { gtag: (...args: unknown[]) => void; }
}

export const pageview = (url: string) => {
  window.gtag('config', GA_ID, { page_path: url });
};

export const event = (action: string, params?: Record<string, unknown>) => {
  window.gtag('event', action, params);
};
