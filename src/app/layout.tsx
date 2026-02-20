import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Small Notes",
  description: "Kirim surat kecil romantis dengan permainan interaktif. Buka surat cinta dengan menyelesaikan berbagai permainan yang menyenangkan.",
  keywords: ["cinta", "surat cinta", "romantic", "love letters", "permainan", "games"],
  authors: [{ name: "Love" }],
  icons: {
    icon: "",
  },
  openGraph: {
    title: "Small Notes",
    description: "Buka surat cinta dengan menyelesaikan permainan interaktif",
    url: "https://chat.z.ai",
    siteName: "Surat Cinta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surat Cinta - Love Letters",
    description: "Kirim surat cinta romantis dengan permainan interaktif",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
