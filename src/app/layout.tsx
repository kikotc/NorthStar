import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "North Star AI | Scholarship Copilot",
  description:
    "North Star AI helps students tell their story, organize scholarship workflows, and submit polished applications on autopilot.",
  metadataBase: new URL("https://northstar.ai"),
  openGraph: {
    title: "North Star AI | Scholarship Copilot",
    description:
      "Craft compelling scholarship essays, stay on schedule, and apply with confidence using North Star AI.",
    url: "https://northstar.ai",
    siteName: "North Star AI",
    images: [
      {
        url: "/logo.svg",
        width: 256,
        height: 256,
        alt: "North Star AI logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "North Star AI | Scholarship Copilot",
    description:
      "We help you translate your story into scholarship-ready applications.",
    creator: "@northstarai",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900 antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
