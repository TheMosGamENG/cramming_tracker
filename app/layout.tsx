import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cramming Tracker - Cram & Conquer",
  description: "Track your school requirements, set smart reminders, and conquer your deadlines with the ultimate student companion",
  keywords: "student, tracker, assignments, deadlines, pomodoro, study timer, school, education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
