import type { Metadata, Viewport } from "next";
import {
  Grenze_Gotisch,
  Oswald,
  Playfair_Display,
  Source_Serif_4,
  Special_Elite,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { StructuredData } from "@/components/seo/structured-data";
import { profile, skillKeywords } from "@/data/profile";
import "./globals.css";

const masthead = Grenze_Gotisch({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-masthead",
});

const hed = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-hed",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body",
});

const cond = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-cond",
});

const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-type",
});

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.fullName} — ${profile.role} in Surat | Yash Times`,
    template: `%s | ${profile.fullName}`,
  },
  description: profile.subheading,
  keywords: [...skillKeywords, "newspaper portfolio", "full stack developer"],
  authors: [{ name: profile.fullName, url: profile.github }],
  openGraph: {
    title: `${profile.fullName} — ${profile.role}`,
    description: profile.subheading,
    url: "/",
    siteName: "Yash Times",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.fullName} — ${profile.role}`,
    description: profile.subheading,
  },
  alternates: { canonical: "/" },
  /* Paste the token from Search Console into GOOGLE_SITE_VERIFICATION and the
     meta tag appears; leave it unset and nothing is emitted. */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  creator: profile.fullName,
  publisher: profile.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
    { media: "(prefers-color-scheme: light)", color: "#ecdec3" },
  ],
};

const editionBootScript = `(function(){var d=document.documentElement;try{var e=localStorage.getItem('edition');var night=e==='night';d.classList.toggle('dark',night);d.classList.toggle('light',!night);}catch(err){}d.classList.add('js');})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${masthead.variable} ${hed.variable} ${body.variable} ${cond.variable} ${typewriter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: editionBootScript }} />
        {/* The accounts that are already this person, claimed from the page. */}
        <link rel="me" href={profile.github} />
        <link rel="me" href={profile.linkedin} />
        <StructuredData />
      </head>
      <body className="newsprint flex min-h-screen flex-col font-body antialiased">
        <div aria-hidden="true" className="fiber pointer-events-none fixed inset-0 z-[3]" />
        <Providers>
          <main className="relative z-[1] flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
