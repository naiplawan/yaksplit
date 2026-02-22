import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/app/providers/query-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FF6B2C",
};

export const metadata: Metadata = {
  title: "YakSplit - Bill Splitting with PromptPay",
  description: "Split bills easily with friends in Bangkok. Generate PromptPay QR codes for each person. No login required.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon.svg", color: "#FF6B2C" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewportHeight />
        <ThemeProvider>
          <QueryClientProvider>
            <div className="flex min-h-screen flex-col bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]">
              <Header />
              <main className="flex-1 pb-safe safe-area-p">
                {children}
              </main>
              <BottomNav />
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
