import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tasino | تاسینو — تجهیزات تأسیسات ساختمان",
  description:
    "فروشگاه تخصصی لوله و اتصالات، شیرآلات، پمپ، ابزارآلات و سیستم‌های سرمایش و گرمایش",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-vazir antialiased`}>
        {children}
      </body>
    </html>
  );
}
