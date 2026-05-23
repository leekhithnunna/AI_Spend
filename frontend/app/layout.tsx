import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Spend Audit Tool — Find Hidden Subscription Waste",
  description:
    "Audit your team's AI subscriptions in minutes. Find overspending, get actionable recommendations, and cut costs by 20–40%. Free, instant, no signup required.",
  keywords: [
    "AI spend audit",
    "AI subscription optimization",
    "ChatGPT cost",
    "GitHub Copilot cost",
    "Claude cost",
    "AI tools ROI",
  ],
  openGraph: {
    title: "AI Spend Audit Tool",
    description: "Find hidden AI subscription waste in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
