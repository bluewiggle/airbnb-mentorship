import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";


export const metadata: Metadata = {
  title: "Airbnb 1:1 Mentorship",
  description: "Direct operator support to get your first (and next) property live — fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />

        {/* ONE continuous background layer */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,90,95,0.18),transparent_44%),radial-gradient(circle_at_82%_26%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,#0b0d10_0%,#0b0d10_35%,#07080a_100%)]" />

        {children}
      </body>
    </html>
  );
}

