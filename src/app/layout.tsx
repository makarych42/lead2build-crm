import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationService";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lead2Build CRM",
  description: "Construction Management CRM System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <GlobalErrorHandler />
        <ErrorBoundary>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
