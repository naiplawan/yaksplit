import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/app/providers/query-provider";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ViewportHeight } from "@/components/layout/ViewportHeight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YakSplit - Bill Splitting with PromptPay",
  description: "Split bills easily with friends in Bangkok. Generate PromptPay QR codes for each person. No login required.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
  themeColor: "#6B4C9A",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewportHeight />
        <QueryClientProvider>
          <div className="flex min-h-screen flex-col bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]">
            <Header />
            <main className="flex-1 pb-safe safe-area-p">
              {children}
            </main>
            <BottomNav />
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
