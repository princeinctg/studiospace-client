import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthContext";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { BookmarkProvider } from "@/components/providers/BookmarkContext";

export const metadata: Metadata = {
  title: "StudioSpace — The Creative Studio Booking Marketplace",
  description:
    "Discover and book premium daylight photo lofts, Dolby Atmos audio suites, virtual film soundstages, and dance rehearsal studios.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <BookmarkProvider>
                {children}
              </BookmarkProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
