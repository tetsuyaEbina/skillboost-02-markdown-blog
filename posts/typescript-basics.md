---
title: "TypeScriptの型は何を確認しているのか"
date: "2026-10-05"
tags:
  - TypeScript
  - 基礎
description: "型チェックと、実際に読み込んだデータの検証の違いを整理します。"
---

## 型とは

値の種類や構造を表す情報です。

```ts
function double(value: number): number {
  return value * 2;
}

double(10);
```

## 型推論

値から型を判断できる場合は、毎回型を書く必要はありません。

```ts
const title = "記事タイトル";
```

### 外部データの検証

TypeScriptの型は、読み込んだファイルの内容を自動検証するものではありません。

## 今回の実装

frontmatterのタイトルが文字列か、日付が実在するかを、実行時にも確認します。
