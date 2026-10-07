# Markdownブログ（静的生成）

Markdownファイルをもとに、記事一覧と記事詳細ページを生成するブログです。

軽量なブログやお知らせサイトを想定し、
DBや管理画面を使わず、ファイルで記事を管理する構成を採用します。

現在は環境構築が完了し、ブログ機能を実装中です。

## 公開URL

未公開。Vercelへのデプロイ後に追記します。

## スクリーンショット

実装完了後に、記事一覧・記事詳細の画面を追加します。

## 想定する利用者

- 技術記事を公開する個人・開発者
- 更新頻度が比較的低いブログやお知らせサイトを運営する事業者

記事更新は、Markdownの編集とGitへのコミットで行います。
ブラウザ上の投稿・編集画面は、この課題の対象外です。

## 実装する機能

- Markdownからの記事一覧・詳細ページ生成
- タイトル・日付・タグの表示
- 日付の新しい順での記事一覧表示
- コードブロックのシンタックスハイライト
- スマートフォンに対応したレイアウト
- 記事ごとのページタイトル・説明文

## 使用技術

| 技術 | 用途 |
|---|---|
| Next.js / App Router | ルーティング・ページの静的生成 |
| React | 画面のコンポーネント |
| TypeScript | 型によるコードの検査 |
| Tailwind CSS | レイアウト・スタイル |
| @tailwindcss/typography | 記事本文のスタイル |
| gray-matter | frontmatterと本文の分離 |
| remark / remark-rehype | Markdownの解析とHTML用構造への変換 |
| rehype-highlight | コードの色分け |
| rehype-stringify | HTML文字列の生成 |
| Vercel | 公開先（予定） |

具体的なバージョンはpackage.jsonとpackage-lock.jsonを参照してください。

## 処理の流れ

1. postsフォルダのMarkdownファイルを読み込む。
2. frontmatterからタイトル・日付・タグを取り出す。
3. Markdown本文をHTMLへ変換する。
4. ビルド時に一覧・詳細ページを生成する。
5. 生成したページを公開する。

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

## 記事の追加方法

実装後は、プロジェクト直下のpostsフォルダに.mdファイルを追加します。

例えばposts/hello-world.mdは、/posts/hello-worldに対応します。

frontmatterの例：

```yaml
---
title: "はじめての記事"
date: "2026-10-07"
tags:
  - Next.js
  - 学習
---
```

この下にMarkdown本文を書きます。
本文の見出しは、記事タイトルとの階層を揃えるため、原則として##から始めます。

## ディレクトリ構成（実装予定）

| パス | 内容 |
|---|---|
| posts/ | Markdown記事 |
| src/lib/posts.ts | 記事の読み込み・検証・変換 |
| src/app/page.tsx | 記事一覧 |
| src/app/posts/[slug]/page.tsx | 記事詳細 |
| src/app/layout.tsx | 共通レイアウト |
| src/app/globals.css | 共通スタイル |
| docs/learning-notes.md | 技術・コマンド・仕組みの説明 |

## 設計方針

- 記事の取得・変換と、画面の表示を分離する。
- ファイル名を記事URLの識別子として使う。
- 自分で管理するMarkdownのみを読み込む。
- 外部ユーザーの投稿・ファイルアップロードは実装しない。
- ページを静的生成し、アクセス時のDB処理を不要にする。

## 達成基準

- [ ] Markdown記事を5本配置
- [ ] タイトル・日付・タグを一覧に表示
- [ ] /posts/[slug]で記事詳細を表示
- [ ] 見出し階層を確認
- [ ] コードブロックのシンタックスハイライトを確認
- [ ] npm run lintが成功
- [ ] npm run buildが成功
- [ ] Vercelへ公開
- [ ] LighthouseのPerformanceが90以上

## 検証結果

実装・公開後に、以下を記録します。

- 公開URL
- 検証日
- Lighthouseの測定条件とスコア
- スマートフォンでの表示・操作確認
- lint・buildの結果

## 依存関係の脆弱性

2026年10月7日の環境構築時に、npm auditで警告を確認しました。
npm audit fixを実行しましたが、警告が残っています。

互換性に影響する自動変更を避けるため、
npm audit fix --forceは実行していません。

残る問題、使用箇所、対応方針は
[学習メモ](docs/learning-notes.md)に記録しています。

依存関係の更新後と公開前に再確認します。
本記載は、脆弱性の解消を示すものではありません。

## 学習メモ

環境構築で実行したコマンドとその意味、
各技術の役割、実装の仕組みは
[学習メモ](docs/learning-notes.md)を参照してください。

## AIの利用

AIを実装案、コードの下書き、説明資料の作成に利用します。
設計、コード、動作、公開内容は制作者が確認します。

## 公開情報の取り扱い

認証情報やクライアントの非公開情報は含めません。
環境変数の実値はGit管理から除外します。
