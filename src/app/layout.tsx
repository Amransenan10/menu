import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "منيو تيك - نظام المنيو الرقمي المتكامل",
  description: "منصة لإدارة المنيو الرقمي للمطاعم والكافيهات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
