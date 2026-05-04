import type { Metadata, Viewport } from "next";
// @ts-ignore
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BNB Lab | Airbnb Mentorship",
  description:
    "BNB Lab — Direct operator support to launch and scale your Airbnb business.",
  metadataBase: new URL("https://www.bnblab.com.au"),

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#0b0d10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const metaPixelIds = process.env.NEXT_PUBLIC_META_PIXEL_IDS
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return (
    <html lang="en">
      <body>
        <SmoothScroll />

        {/* One continuous background across the whole page, including safe areas */}
        <div className="site-chrome-bg" />

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {metaPixelIds && metaPixelIds.length > 0 && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');

                ${metaPixelIds.map((id) => `fbq('init', '${id}');`).join('\n')}
                ${metaPixelIds.map((id) => `fbq('trackSingle', '${id}', 'PageView');`).join('\n')}
              `}
            </Script>

            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelIds[0]}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {children}
      </body>
    </html>
  );
}