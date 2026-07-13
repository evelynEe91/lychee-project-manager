import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "lycheeVoice2.0 项目管理助手",
  description: "面向项目负责人的中文项目管理演示原型"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
