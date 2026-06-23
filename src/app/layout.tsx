import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "PropAI | 物件説明文を30秒で自動生成",
  description: "不動産仲介会社向けAIツール。物件説明文・内覧メール・SNS投稿を瞬時に生成。月額4,980円〜。14日間無料トライアル。",
  keywords: "不動産,AI,物件説明文,自動生成,賃貸,仲介",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className={`${notoSansJP.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
