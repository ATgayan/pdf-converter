import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PDConverter - Convert Images to PDF and PDF to Images",
  description: "Professional file conversion tool for images and PDFs",
  icons: {
    icon: "/favicon.ico",
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
  <Suspense fallback={null}>
    {children}
  </Suspense>
  <SpeedInsights/>
  <Analytics />
</body>

    </html>
  )
}
