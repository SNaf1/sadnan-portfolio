import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Tracker } from "@/components/Tracker";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sadnan Nafis",
  description:
    "Portfolio of Sadnan Nafis — Full Stack AI Engineer specializing in LLM systems, scalable web apps, and AI-driven products. Based in Dhaka, working with US companies.",
  keywords: ["Sadnan Nafis", "AI Engineer", "Full Stack Developer", "LLM", "Next.js", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
