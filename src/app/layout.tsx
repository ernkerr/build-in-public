import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Nav, MobileNav } from "@/components/nav";
import { ScheduleChecker } from "@/components/schedule-checker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "build-in-public",
  description: "Turn git commits and dev notes into build-in-public posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="flex h-screen flex-col overflow-hidden bg-background text-foreground antialiased md:flex-row">
        <MobileNav />
        <aside className="hidden w-56 shrink-0 border-r border-border md:block">
          <Nav />
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        <ScheduleChecker />
        <Toaster />
      </body>
    </html>
  );
}
