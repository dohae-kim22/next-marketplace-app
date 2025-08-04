import type { Metadata } from "next";
import { Geist, Geist_Mono, Audiowide } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!["fr", "en"].includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${audioWide.variable} antialiased bg-neutral-900 text-white`}
      >
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
