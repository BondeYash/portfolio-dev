import type { Metadata, Viewport } from "next";
import {
  Oswald,
  Playfair_Display,
  Source_Serif_4,
  Special_Elite,
  UnifrakturMaguntia,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { profile, skillKeywords } from "@/data/profile";
import "./globals.css";

const masthead = UnifrakturMaguntia({
  weight: "400",
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Yash Times | ${profile.fullName}, ${profile.role}`,
    template: `%s | Yash Times`,
  },
  description: profile.subheading,
  keywords: [...skillKeywords, "newspaper portfolio", "full stack developer"],
  authors: [{ name: profile.fullName, url: profile.github }],
  openGraph: {
    title: `Yash Times | ${profile.fullName}`,
    description: profile.subheading,
    url: siteUrl,
    siteName: "Yash Times",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Yash Times | ${profile.fullName}`,
    description: profile.subheading,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
    { media: "(prefers-color-scheme: light)", color: "#f3eee2" },
  ],
};

const editionBootScript = `(function(){var d=document.documentElement;try{var e=localStorage.getItem('edition');var night=e?e==='night':window.matchMedia('(prefers-color-scheme: dark)').matches;d.classList.toggle('dark',night);d.classList.toggle('light',!night);}catch(err){}d.classList.add('js');})();`;

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
