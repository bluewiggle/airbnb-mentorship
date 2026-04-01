import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BNB Lab | Airbnb Mentorship",
  description:
    "BNB Lab — Direct operator support to launch and scale your Airbnb business.",
  metadataBase: new URL("https://www.bnblab.com.au"),
  themeColor: "#0b0b0f",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0b0b0f]">
      <body className="bg-[#0b0b0f]">
        <SmoothScroll />

        {/* Background layer */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,90,95,0.18),transparent_44%),radial-gradient(circle_at_82%_26%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,#0b0d10_0%,#0b0d10_35%,#07080a_100%)]" />

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