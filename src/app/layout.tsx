import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BNB Lab | Airbnb Mentorship",
  description:
    "BNB Lab — Direct operator support to launch and scale your Airbnb business.",
  metadataBase: new URL("https://www.bnblab.com.au"),

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
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
  return (
    <html lang="en">
      <body>
        <SmoothScroll />

        {/* One continuous background across the whole page, including safe areas */}
        <div className="site-chrome-bg" />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {children}
      </body>
    </html>
  );
}