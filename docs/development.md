# No.02 Markdownブログ：開発・更新手順

[作品概要へ戻る](../README.md)

## 処理の流れ

1. postsフォルダのMarkdownファイルを読み込む。
2. frontmatterからタイトル・日付・タグ・説明文を取り出して検証する。
3. Markdown本文をHTMLへ変換する。
4. generateStaticParamsで、生成対象の記事URLを指定する。
5. ビルド時に一覧・詳細ページを生成する。
6. 生成したページを公開する。

DBや外部APIは使用していません。
記事を更新した場合は、再ビルドして公開内容に反映します。

## ローカルでの起動

Node.jsのバージョンは.node-versionに記録しています。

fnmを使用している場合：

```bash
fnm install
fnm use
npm ci
npm run dev
```

ブラウザで http://localhost:3000 を開きます。
ポートが使用中の場合は、ターミナルに表示されたURLを使用してください。

## 品質確認

```bash
npm run lint
npm run build
npm audit
```

本番用の表示をローカルで確認する場合：

```bash
npm run start
```

npm run startの前に、npm run buildを実行してください。

記事一覧だけでなく、記事詳細ページでも
見出し、コード表示、スマートフォンでの表示を確認します。

## 更新方法

プロジェクト直下のpostsフォルダに.mdファイルを追加・編集します。

例えばposts/hello-world.mdは、/posts/hello-worldに対応します。
ファイル名は、小文字英数字とハイフンを使用します。

記事の記述例：

````markdown
---
title: "はじめての記事"
date: "2026-10-07"
tags:
  - Next.js
  - 学習
description: "この記事で説明する内容の概要です。"
---

## 最初の見出し

ここに本文を書きます。

### 補足の見出し

ここに補足を書きます。

```ts
const message = "Hello, Markdown!";
console.log(message);
```
````

記事タイトルはページ側でh1として表示するため、
本文の見出しは##から始めます。

変更後はローカルで確認し、コミットしてGitHubへpushします。
VercelとのGit連携によって再ビルドされ、公開内容へ反映します。

ファイル名の変更は記事URLの変更になるため、
公開済みの記事では慎重に扱います。

## ディレクトリ構成

| パス | 内容 |
|---|---|
| posts/ | Markdown記事5本 |
| src/lib/posts.ts | 記事の読み込み・検証・HTML変換 |
| src/app/page.tsx | 記事一覧 |
| src/app/posts/[slug]/page.tsx | 記事詳細・静的生成対象・記事メタデータ |
| src/app/layout.tsx | 共通レイアウト・メタデータ |
| src/app/not-found.tsx | 404画面 |
| src/app/globals.css | 共通スタイル・コードの色分け |
| next.config.ts | Next.jsの設定 |
| docs/learning-notes.md | コマンド・技術・仕組みの説明 |

## 関連ドキュメント

- [検証記録](verification.md)
- [学習メモ](learning-notes.md)
- [記事から公開ページになるまでの流れ](learning-notes.md#rendering-flow)

