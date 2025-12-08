import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDConverter – Convert Images to PDF & PDF to Images Online | Free & Fast",
  description:
    "PDConverter is a professional online tool to convert images to PDF and PDF to images. Fast, secure, free, and works on any device.",
  keywords: [
    "PDF converter",
    "image to PDF",
    "PDF to image",
    "jpg to PDF",
    "png to PDF",
    "PDF maker",
    "online PDF converter",
    "free PDF tool",
    "document converter",
    "convert PDF online"
  ],
  authors: [{ name: "PDConverter Team" }],
  applicationName: "PDConverter",
  themeColor: "#ffffff",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PDConverter – Convert Images to PDF & PDF to Images Online | Free & Fast",
    description:
      "Convert images to PDF and PDF to images instantly with PDConverter. Secure, fast, and free online tool for all devices.",
    url: "https://www.pdconverter.app/",
    siteName: "PDConverter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDConverter – Convert Images to PDF & PDF to Images Online",
    description: "Free online tool to convert images to PDF or PDF to images instantly.",
    creator: "@ATGayan", 
  },
  metadataBase: new URL("https://www.pdconverter.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
