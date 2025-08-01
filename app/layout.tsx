import type { Metadata } from "next";
import { Geist, Geist_Mono, Audiowide } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const audioWide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-audio-wide",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Next Marketplace",
    default: "Next Marketplace",
  },
  description:
    "A community marketplace app where users can buy and sell locally with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${audioWide.variable} antialiased bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
