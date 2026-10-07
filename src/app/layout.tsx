import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Engineering Notes | 蛯名哲也",
    template: "%s | Engineering Notes",
  },
  description: "Web開発の仕組みと実装の学びを記録するMarkdownブログ。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4"
        >
          本文へ移動
        </a>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
            <Link href="/" className="font-bold tracking-tight">
              ENGINEERING NOTES<span className="text-teal-700">.</span>
            </Link>
            <span className="text-xs text-slate-500">Tetsuya Ebina</span>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-500">
          © Tetsuya Ebina
        </footer>
      </body>
    </html>
  );
}
