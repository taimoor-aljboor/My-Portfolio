import Script from 'next/script';

type AnalyticsScriptsProps = {
  analyticsId: string | null;
};

export function AnalyticsScripts({ analyticsId }: AnalyticsScriptsProps) {
  if (!analyticsId) return null;

  const src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;

  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(analyticsId)});
        `}
      </Script>
    </>
  );
}
