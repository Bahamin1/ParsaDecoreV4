import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Parsa Decor - Premium Interior Design & Decor",
  description:
    "Transforming spaces into extraordinary experiences with premium interior design solutions. Residential and commercial interior design services.",
  generator: "v0.app",
  keywords: "interior design, home decor, commercial design, residential design, luxury interiors",
  authors: [{ name: "Parsa Decor" }],
  openGraph: {
    title: "Parsa Decor - Premium Interior Design",
    description: "Transforming spaces into extraordinary experiences",
    type: "website",
    images: ["/images/parsa-logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
