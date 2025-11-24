import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "PDF Converter - Convert Images to PDF and PDF to Images",
  description: "Professional file conversion tool for images and PDFs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Navigation />
            {children}
            <Toaster />
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
