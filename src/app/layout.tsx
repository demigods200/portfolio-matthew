import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matthew Wu — Senior AI Systems Engineer",
  description:
    "Senior software engineer specializing in AI pipelines, hybrid search, and real-time systems. Currently at Atlassian (Loom).",
  openGraph: {
    title: "Matthew Wu — Senior AI Systems Engineer",
    description:
      "I turn AI capabilities into reliable product systems. Senior engineer at Atlassian (Loom).",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Wu — Senior AI Systems Engineer",
    description: "I turn AI capabilities into reliable product systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${dmSerif.variable} font-sans`}
    >
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
