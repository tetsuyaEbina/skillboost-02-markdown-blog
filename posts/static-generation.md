---
title: "静的生成でブログを公開する"
date: "2026-10-04"
tags:
  - Next.js
  - SSG
description: "ビルド時にページを作る方式と、記事更新時の流れを整理します。"
---

## 静的生成とは

アクセスのたびにページを生成する代わりに、事前にページを生成する方式です。

## 記事URLを列挙する

generateStaticParamsで、生成対象の記事をNext.jsへ伝えます。

```ts
export function generateStaticParams() {
  return [
    { slug: "first-post" },
    { slug: "second-post" },
  ];
}
```

### 記事更新の流れ

1. Markdownを編集する
2. GitHubへ変更を送る
3. 再ビルドする
4. 公開内容を更新する

## 適した用途

記事更新のたびにビルドできる、小規模ブログやお知らせサイトに適した選択肢です。
