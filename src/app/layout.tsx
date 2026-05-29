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

  return (
    <html lang="en">
      <body>
        <SmoothScroll />

        <div className="site-chrome-bg" />

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

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wywgpzh7ti");
          `}
        </Script>

        <Script id="bnb-lab-attribution-and-meta-pixel" strategy="afterInteractive">
          {`
            (function () {
              var PIXELS = {
                n: "1788895448752082",
                l: "2097284224148333"
              };

              var REF_TO_NAME = {
                n: "Noah",
                l: "Liam"
              };

              var STORAGE_KEY = "bnb_attribution";
              var COOKIE_DAYS = 30;

              function setCookie(name, value, days) {
                var maxAge = days * 24 * 60 * 60;
                document.cookie =
                  name + "=" + encodeURIComponent(value) +
                  "; path=/; max-age=" + maxAge +
                  "; SameSite=Lax";
              }

              function getCookie(name) {
                var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
                return match ? decodeURIComponent(match[2]) : null;
              }

              function safeJsonParse(value) {
                try {
                  return JSON.parse(value);
                } catch (e) {
                  return null;
                }
              }

              function getStoredAttribution() {
                var localValue = null;

                try {
                  localValue = localStorage.getItem(STORAGE_KEY);
                } catch (e) {}

                var cookieValue = getCookie(STORAGE_KEY);
                return safeJsonParse(localValue) || safeJsonParse(cookieValue);
              }

              function saveAttribution(data) {
                var value = JSON.stringify(data);

                try {
                  localStorage.setItem(STORAGE_KEY, value);
                } catch (e) {}

                setCookie(STORAGE_KEY, value, COOKIE_DAYS);

                window.__BNB_ATTRIBUTION__ = data;
              }

              function getCurrentAttribution() {
                var params = new URLSearchParams(window.location.search);
                var ref = params.get("ref");

                var hasNewRef = ref === "n" || ref === "l";
                var stored = getStoredAttribution();

                if (hasNewRef) {
                  var data = {
                    ref: ref,
                    referrer: REF_TO_NAME[ref],
                    pixel_id: PIXELS[ref],
                    fbclid: params.get("fbclid") || "",
                    utm_source: params.get("utm_source") || "",
                    utm_medium: params.get("utm_medium") || "",
                    utm_campaign: params.get("utm_campaign") || "",
                    utm_content: params.get("utm_content") || "",
                    utm_term: params.get("utm_term") || "",
                    landing_page: window.location.href,
                    first_seen_at: stored && stored.ref === ref && stored.first_seen_at
                      ? stored.first_seen_at
                      : new Date().toISOString(),
                    last_seen_at: new Date().toISOString()
                  };

                  saveAttribution(data);
                  return data;
                }

                if (stored && stored.ref && PIXELS[stored.ref]) {
                  stored.last_seen_at = new Date().toISOString();
                  saveAttribution(stored);
                  return stored;
                }

                window.__BNB_ATTRIBUTION__ = null;
                return null;
              }

              var attribution = getCurrentAttribution();

              if (!attribution || !attribution.pixel_id) {
                console.log("BNB attribution: no ref found, Meta pixel not loaded.");
                return;
              }

              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq("init", attribution.pixel_id);
              fbq("trackSingle", attribution.pixel_id, "PageView", {
                ref: attribution.ref,
                referrer: attribution.referrer,
                fbclid: attribution.fbclid,
                utm_source: attribution.utm_source,
                utm_medium: attribution.utm_medium,
                utm_campaign: attribution.utm_campaign,
                utm_content: attribution.utm_content,
                utm_term: attribution.utm_term
              });

              console.log("BNB attribution pixel loaded:", attribution);
            })();
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}