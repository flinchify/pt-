import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AnywherePT | Find Verified Personal Trainers Near You",
    template: "%s | AnywherePT",
  },
  description:
    "Find and book verified personal trainers across Australia. Health is Wealth. Browse by specialisation, location, and price.",
  metadataBase: new URL("https://anywherept.com.au"),
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://anywherept.com.au",
    siteName: "AnywherePT",
    title: "AnywherePT | Find Verified Personal Trainers Near You",
    description:
      "Find and book verified personal trainers across Australia. Health is Wealth.",
    images: [
      {
        url: "https://anywherept.com.au/og-image.png",
        width: 1200,
        height: 630,
        alt: "AnywherePT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnywherePT | Find Verified Personal Trainers Near You",
    description:
      "Find and book verified personal trainers across Australia. Health is Wealth.",
    images: ["https://anywherept.com.au/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AnywherePT",
  url: "https://anywherept.com.au",
  logo: "https://anywherept.com.au/logo.png",
  description:
    "Australia's marketplace for verified personal trainers. Health is Wealth.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "AU",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+61-1300-278-287",
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.facebook.com/anywherept",
    "https://www.instagram.com/anywherept",
    "https://www.linkedin.com/company/anywherept",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AnywherePT",
  url: "https://anywherept.com.au",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://anywherept.com.au/trainers?suburb={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
