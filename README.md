# Markdownブログ（静的生成）

Markdownファイルをもとに、記事一覧と記事詳細ページを生成するブログです。

実案件を想定した制作課題として、
記事管理の設計から実装・公開・検証まで取り組んでいます。

## 開発状況

記事5本、一覧・詳細ページ、シンタックスハイライトを実装しています。
ローカルでのlint・本番ビルドは成功しています。

Vercelの公開URLを発行済みです。
公開後の動作・性能確認はこれから実施します。

## 公開URL

[Markdownブログを開く](https://skillboost-02-markdown-blog.vercel.app/)

## スクリーンショット

記事一覧・記事詳細のPC・スマートフォン画面を追加予定です。

## 想定する閲覧者と目的

- 技術記事を読むエンジニア・学習者
- 軽量なブログやお知らせサイトを検討する事業者
- 制作物を確認する企業の採用担当者・開発担当者

DBや管理画面を使わず、Markdownファイルで記事を管理し、
読みやすい記事一覧・詳細ページを提供することを目指します。

## 主な機能

- Markdownからの記事一覧・詳細ページ生成
- タイトル・日付・タグ・説明文の表示
- 日付の新しい順での記事一覧表示
- frontmatterの必須項目・日付・タグの検証
- 本文のh1を検出する見出し階層の検証
- コードブロックのシンタックスハイライト
- 画面幅に応じたレイアウト
- 記事ごとのページタイトル・説明文
- 存在しない記事URLの404表示
- キーボード操作時のフォーカス表示
- 本文へのスキップリンク

## 使用技術

| 技術 | 用途 |
|---|---|
| Next.js 16 / App Router | ルーティング・ページの静的生成 |
| React 19 | 画面のコンポーネント |
| TypeScript | 型によるコードの検査 |
| Tailwind CSS 4 | レイアウト・スタイル |
| @tailwindcss/typography | 記事本文のスタイル |
| gray-matter | frontmatterと本文の分離 |
| remark | Markdownの解析 |
| remark-rehype | MarkdownからHTML用構造への変換 |
| rehype-highlight | コードの色分け |
| rehype-stringify | HTML文字列の生成 |
| Node.js fs / path | 記事ファイルの読み込み・パスの組み立て |
| ESLint | コードの検査 |
| Vercel | サイトの公開 |

具体的なバージョンはpackage.jsonとpackage-lock.jsonを参照してください。

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

## 設計上の工夫

- 記事の読み込み・変換と、画面の表示を分離
- frontmatterの不備を検出し、修正するファイルと項目を通知
- 日付順に並べ、同じ日付ではslug順にして表示順を安定化
- 記事タイトルをh1、本文をh2以下にして見出し階層を整理
- 長いコードはコードブロック内で横スクロール
- 記事ごとにタイトルと説明文を設定
- generateStaticParamsで記事ページを事前生成
- dynamicParamsをfalseにして、未登録の記事URLを404にする
- 上記構成に合わせてCache Componentsを無効化
- 自作記事のみを読み込み、Markdown内の生HTMLは通さない

dangerouslySetInnerHTMLには、変換処理で生成したHTMLを渡しています。
外部ユーザーの投稿やアップロードを受け付ける場合は、
別途入力検証・HTMLの安全性対策を検討する必要があります。

## 達成基準

- [x] Markdown記事を5本配置
- [x] npm run lintが成功
- [x] npm run buildが成功
- [x] Vercelの公開URLを発行
- [x] 公開環境でタイトル・日付・タグの表示を確認
- [x] /posts/[slug]の見出し階層を確認
- [x] コードブロックのシンタックスハイライトを確認
- [x] スマートフォン実機で表示・操作を確認
- [x] LighthouseのPerformanceが90以上

## 検証結果

| 項目 | 結果 |
|---|---|
| ローカル確認日 | 2026年10月7日 |
| 公開URL | https://skillboost-02-markdown-blog.vercel.app/ |
| 記事数 | 5本 |
| lint | 成功 |
| build | 成功 |
| 公開後の表示・操作 | 成功 |
| Lighthouse測定URL | https://skillboost-02-markdown-blog.vercel.app/ |
| スマートフォン実機 | 成功 |
| 依存関係の監査 | 下記参照。更新後の再監査結果は追記予定 |

性能スコアは、測定日・対象URL・端末設定とともに記録します。

## 依存関係の確認

2026年10月7日の環境構築時にnpm auditを実行し、
依存元を含め11件の警告を確認しました。

主な原因：

| パッケージ | 依存経路 |
|---|---|
| braces | ESLint関連 |
| postcss-selector-parser | @tailwindcss/typography関連 |
| sprintf-js | gray-matter関連 |

npm audit fixを実行しましたが、警告が残りました。

npm audit fix --forceは、関連パッケージを古いメジャーバージョンへ
変更する提案を含んでいたため、実行していません。

今回は自作のMarkdownをビルド時に処理し、
外部から記事、CSS、検索パターン、書式文字列を受け取る機能は設けていません。
ただし、脆弱性が解消したことを意味するものではありません。

依存関係の更新と再監査を行い、結果を記録します。
詳細は[学習メモ](docs/learning-notes.md)を参照してください。

## 学習メモ

環境構築で実行したコマンドとその意味、
React・TypeScript・App Router、
Markdown変換と静的生成の仕組みは
[学習メモ](docs/learning-notes.md)にまとめています。

## AIの利用

AIを実装案、コードの下書き、ドキュメント作成に利用しました。
設計、コード、動作、公開内容は制作者が確認します。

## 公開情報の取り扱い

認証情報やクライアントの非公開情報は含めません。
環境変数の実値はGit管理から除外します。
