---
title: "Next.jsのApp Routerでページが表示される仕組み"
date: "2026-10-07"
tags:
  - Next.js
  - React
description: "page.tsxとlayout.tsxが、どのようにページを構成するのか整理します。"
---

## App Routerとは

Next.jsのページ管理方式です。フォルダとファイルの配置からURLが決まります。

- `src/app/page.tsx`はトップページ
- `src/app/posts/[slug]/page.tsx`は記事詳細
- `src/app/layout.tsx`は共通レイアウト

## ページとレイアウト

Next.jsがページを共通レイアウトへ組み込みます。

```tsx
export default function Home() {
  return <h1>記事一覧</h1>;
}
```

### childrenの役割

レイアウトの`children`には、配下のページ内容が渡されます。

## 今回の学び

ページ内容と共通の枠を分けることで、複数ページでも構造を揃えられます。
