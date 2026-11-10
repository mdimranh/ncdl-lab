import type { Metadata } from "next";
import { Geist_Mono, Noto_Serif } from "next/font/google";
import { getLocale } from "@/lib/locale";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NCDL — Neuromorphic Chip Design Laboratory",
    template: "%s · NCDL",
  },
  description:
    "The Neuromorphic Chip Design Laboratory designs brain-inspired silicon, RF/analog front-ends, FPGA accelerators and robotics control hardware.",
  keywords: [
    "neuromorphic engineering",
    "chip design",
    "spiking neural networks",
    "RF analog circuits",
    "FPGA",
    "robotics control",
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale === "ko" ? "ko" : "en"}
      className={`${notoSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
