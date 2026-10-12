import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { getInitials, getSiteUrl, isConfiguredUrl, ownerName } from "@/lib/utils";
import { Atmosphere } from "@/components/background/Atmosphere";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const serif = Instrument_Serif({ weight: "400", style: ["italic"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

const name = ownerName();
const title = `${name}: Computer Science, Data Science & Finance`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: title, template: `%s | ${name}` },
  description: site.metaDescription,
  // Canonical only once a real production URL is configured.
  ...(isConfiguredUrl(site.siteUrl) ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    title,
    description: site.metaDescription,
    siteName: name,
  },
  twitter: { card: "summary_large_image", title, description: site.metaDescription },
};

export const viewport: Viewport = {
  themeColor: "#080b16",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Marks motion as allowed (html.js) unless the visitor
 * prefers reduced motion; the CSS only hides content for reveals under .js.
 * Failsafe: if client motion has not taken over after 3.5s, reveal everything.
 */
const headScript = `(function(){var d=document.documentElement;try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js');try{if(sessionStorage.getItem('intro-seen')==='1'){d.classList.add('intro-seen')}}catch(e){}setTimeout(function(){if(!window.__motionReady){d.classList.add('reveal-all')}},3500)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initials = getInitials(site.name, site.monogramFallback);
  const resumeUrl = isConfiguredUrl(site.contact.resume) ? site.contact.resume : undefined;

  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Atmosphere />
        <Navbar
          nav={site.nav}
          initials={initials}
          resumeUrl={resumeUrl}
          sectionNav={site.sectionNav}
          ownerLabel={name}
        />
        <div className="relative z-[1]">
          {children}
          <Footer name={site.name} />
        </div>
        <MotionRoot />
      </body>
    </html>
  );
}
