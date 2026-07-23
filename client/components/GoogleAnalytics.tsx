'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_ID, pageview } from '@/lib/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  useEffect(() => { if (GA_ID) pageview(pathname); }, [pathname]);
  if (!GA_ID) return null;
  return (
    <>
      {/* Google Analytics */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      {/* Google Ads conversion tracking */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17581395753" strategy="afterInteractive" />
      <Script id="gtag-ads-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-17581395753');
      `}</Script>
      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '851252584338092');
        fbq('track', 'PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=851252584338092&ev=PageView&noscript=1" alt="" />
      </noscript>
    </>
  );
}
