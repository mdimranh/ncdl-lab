import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
