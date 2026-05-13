import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "STUNET — Next-Gen Student Network",
  description: "Experience the next generation of talent acquisition and career progression. Showcase real-world skills, prove expertise, and connect with top companies.",
  keywords: ["student network", "internships", "jobs", "career progression", "talent acquisition"],
  authors: [{ name: "STUNET" }],
  openGraph: {
    title: "STUNET — Next-Gen Student Network",
    description: "Experience the next generation of talent acquisition and career progression. Showcase real-world skills, prove expertise, and connect with top companies.",
    url: "https://stunet.vercel.app",
    siteName: "STUNET",
    images: [
      {
        url: "https://stunet.vercel.app/og-image.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "STUNET Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STUNET — Next-Gen Student Network",
    description: "Experience the next generation of talent acquisition and career progression. Showcase real-world skills, prove expertise, and connect with top companies.",
    images: ["https://stunet.vercel.app/og-image.jpg"],
  },
};

import Chatbot from "./components/Chatbot";
import { ThemeProvider } from "./components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased dual-sense-texture`}
      >
        <ThemeProvider>
          {children}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
