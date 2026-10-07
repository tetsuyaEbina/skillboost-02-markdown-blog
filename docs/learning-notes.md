# No.02 Markdownブログ：環境構築と学習メモ

## 1. この課題で作るもの

Markdownファイルをもとに、記事一覧と記事詳細ページを生成するブログ。

記事はDBではなく、プロジェクト直下のpostsフォルダに保存する。

処理の流れ：

1. postsフォルダからMarkdownファイルを読む。
2. タイトル・日付・タグと、本文を分離する。
3. Markdown本文をHTMLへ変換する。
4. 記事一覧と詳細ページを生成する。

本番では記事ページをビルド時に生成する。
記事を更新した場合は、再ビルドして公開内容へ反映する。

## 2. 技術の役割

| 技術 | 役割 |
|---|---|
| Node.js | 開発サーバーやビルド処理を動かす実行環境 |
| npm | ライブラリの管理と、開発・ビルドコマンドの実行 |
| React | 画面をコンポーネントとして記述する |
| Next.js | ページ生成、URLとページの対応、共通レイアウトなどを提供する |
| App Router | Next.jsのファイル構造に基づくページ管理方式 |
| TypeScript | 型によってコードの不整合を見つけやすくする |
| Tailwind CSS | クラス名で見た目を指定する |
| Git | ソースコードの変更履歴を管理する |
| GitHub | コードと変更履歴を共有・公開する |
| Vercel | 本番用にビルドし、サイトを公開する |

Reactを使うNext.jsのプロジェクトなので、今回もReactを使用する。
App Routerは独立した製品ではなく、Next.jsの仕組み。

## 3. Node.jsの準備

### fnmを現在のターミナルで有効にする

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

fnmは、Node.jsのバージョン管理ツール。

fnm envは、fnmを使うためのシェル設定を出力する。
$(...)は、そのコマンドの出力を取り出す構文。
evalは、その出力を現在のシェルで実行する。

--shell zshは、zsh用の設定を生成する指定。
--use-on-cdは、フォルダ移動時にNode.jsの自動切り替えを有効にする指定。

今回、.zshrcへ書き込めなかったため、
新しいターミナルではこのコマンドを再実行する。

### Node.js 24へ切り替える

```bash
fnm use 24
```

インストール済みのNode.js 24を、現在のターミナルで使用する。

### コマンドの検索情報を更新する

```bash
rehash
```

zshが保持するコマンドの検索情報を更新する。
Node.jsを切り替えた後に、古い実行ファイルが使われる場合の確認・対処に使う。

### バージョンを確認する

```bash
node -v
npm -v
```

-vはバージョン表示。
現在のターミナルで実際に使われるバージョンを確認できる。

## 4. プロジェクトの作成

### 作業場所へ移動する

```bash
cd /Users/ebinatetsuya/systems/skillboost
```

cdは、現在の作業ディレクトリを変更するコマンド。

### Next.jsの雛形を作る

```bash
npx create-next-app@latest 02-markdown-blog --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --disable-git
```

| 部分 | 意味 |
|---|---|
| npx | npmパッケージが提供するコマンドを実行する |
| create-next-app | Next.jsのプロジェクト作成ツール |
| @latest | npm上でlatestとして指定されたバージョンを使用する |
| 02-markdown-blog | 作成するフォルダ・プロジェクト名 |
| --ts | TypeScriptを採用する |
| --eslint | ESLintを設定する |
| --tailwind | Tailwind CSSを設定する |
| --app | App Routerを採用する |
| --src-dir | ソースコードをsrcフォルダに置く |
| --import-alias "@/*" | @/でsrc内のファイルを参照できるようにする |
| --use-npm | パッケージ管理をnpmにする |
| --disable-git | Gitの自動初期化を行わない |

create-next-appは、雛形の作成と必要なライブラリのインストールを行う。

@latestは作成時の指定。
その後の依存関係はpackage.jsonとpackage-lock.jsonで管理する。

### プロジェクトへ移動する

```bash
cd /Users/ebinatetsuya/systems/skillboost/02-markdown-blog
```

この後のnpmやGitの操作は、基本的にこのフォルダで実行する。

### Node.jsのバージョンを記録する

```bash
node -v > .node-version
```

node -vの出力を.node-versionへ保存する。

>は、出力をファイルへ書き込む記号。
ファイルが既にあれば、その内容を置き換える。

.node-versionをGit管理しておくと、
他の環境でも使用したNode.jsのバージョンを確認できる。
fnmは、このファイルをバージョン選択に利用できる。

## 5. Markdown関連ライブラリの追加

```bash
npm install gray-matter remark remark-rehype rehype-highlight rehype-stringify
```

npm installは、指定したパッケージと、その依存パッケージをインストールする。

通常、この操作で次が更新される。

- package.json：直接使用する依存関係
- package-lock.json：解決された依存関係と具体的なバージョン
- node_modules：インストールしたパッケージの実体

### 各ライブラリの役割

| ライブラリ | 役割 |
|---|---|
| gray-matter | frontmatterと本文を分離する |
| remark | Markdownを解析する |
| remark-rehype | Markdownの構造をHTML用の構造へ変換する |
| rehype-highlight | コードブロックに色分け用の情報を追加する |
| rehype-stringify | HTML用の構造をHTML文字列へ変換する |

### Markdownとは

記号を使って、見出し・一覧・コードなどを書く文書形式。

例えば：

```markdown
## 見出し

- 項目A
- 項目B
```

HTMLを直接書くより、記事本文を編集しやすい。

### frontmatterとは

記事の先頭に置く、タイトル・日付・タグなどの情報。

今回の例：

```yaml
---
title: "はじめての記事"
date: "2026-10-07"
tags:
  - Next.js
  - 学習
---
```

この部分の下にMarkdown本文を書く。

### YAMLとは

名前と値、リストなどで構造化データを書く形式。
今回のfrontmatterで使う。

日付は文字列として扱えるよう、引用符で囲む。

### パースとは

文字列を、プログラムが扱える構造へ解析すること。

gray-matterはfrontmatterを解析して、
title・date・tagsなどを取り出せる形にする。

### ASTとは

文章やコードの構造を、木構造で表したもの。
Abstract Syntax Treeの略で、日本語では抽象構文木。

Markdownの見出し、段落、コードブロックなどを、
単なる文字列ではなく、種類を持つ要素として扱える。

remarkはMarkdownのASTを扱う。
remark-rehypeでHTML用のASTへ変換し、
rehype系の処理を適用する。

### シンタックスハイライトとは

コードのキーワードや文字列などを色分けすること。

rehype-highlightは色分け用のクラスなどを追加する。
実際の色は、別途読み込むCSSで指定する。

ライブラリをインストールしただけでは、画面に色は付かない。
記事変換処理とCSSへの組み込みが必要。

## 6. 記事用のスタイルを追加する

```bash
npm install -D @tailwindcss/typography
```

-Dは、package.jsonのdevDependenciesへ登録する指定。

@tailwindcss/typographyは、
記事の見出し、段落、一覧、引用、コードなどの見た目を整えるプラグイン。

Tailwind CSSは基本スタイルをリセットするため、
生成したHTMLの見出しなどに、自動で十分な装飾が付くとは限らない。
Typographyを使うと、記事全体のスタイルをまとめて指定できる。

### dependenciesとdevDependencies

| 分類 | 意図 |
|---|---|
| dependencies | アプリの機能に必要なパッケージ |
| devDependencies | 開発・検査・ビルドに必要なパッケージ |

devDependenciesも、ビルド環境では必要になる。
「公開サイトに関係ない」「脆弱性が無関係」という意味ではない。

## 7. 脆弱性の確認と今回の対応

### 実行したコマンド

```bash
npm audit fix
npm audit
```

| コマンド | 意味 |
|---|---|
| npm audit | 依存パッケージの既知の脆弱性を確認する |
| npm audit fix | 許容される依存関係の範囲で、自動修正を試す |
| npm audit fix --force | メジャーバージョン変更なども含む修正を許可する |

今回、--forceは実行していない。

提示された修正案には、eslint-config-nextやgray-matterなどを
古いメジャーバージョンへ変更するものが含まれていた。
互換性への影響を確認せずに実行しない方針とした。

### 確認時点の結果

2026年10月7日の監査では、11件の警告が報告された。

これは11個の独立した問題という意味ではなく、
問題を持つパッケージと、その依存元を含む件数。

主な原因：

| パッケージ | 問題 | 今回の依存経路 |
|---|---|---|
| braces | 深く入れ子になったパターンによる処理停止 | ESLint関連 |
| postcss-selector-parser | 特定の長いCSSセレクターによるCPU消費 | Typography関連 |
| sprintf-js | 不正な精度指定による例外 | gray-matterの依存先 |

### 方針

- 自作のMarkdownだけを、ビルド時に処理する。
- 外部ユーザーの記事投稿やファイルアップロード機能は作らない。
- 外部から検索パターンや書式文字列を受け取る機能は作らない。
- 更新可能な依存関係を確認する。
- 残る警告を記録し、公開前と依存更新時に再確認する。

課題を満たせることと、脆弱性が解消していることは別。
警告が残っている場合は、「脆弱性なし」と記載しない。

### 更新確認用のコマンド

```bash
npm update @tailwindcss/typography postcss-selector-parser
npm audit
```

npm updateは、許容されるバージョン範囲で更新を試す。
必ず修正版へ変わるとは限らないため、監査結果を再確認する。

### アドバイザリ

- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-rj75-hqrm-r3gf
- https://github.com/advisories/GHSA-hp3w-g68c-fv3c

## 8. Gitの初期設定

以下は未実行なら実行する。

```bash
git init -b main
git add .
git commit -m "chore: initialize Markdown blog"
```

| コマンド | 意味 |
|---|---|
| git init -b main | mainブランチでGit管理を開始する |
| git add . | 現在のフォルダ配下の変更を、コミット対象へ登録する |
| git commit -m "..." | 登録した変更を、説明付きで履歴に保存する |

git addはGitHubへ送信する操作ではない。
git commitも、ローカルへの履歴保存。
GitHubへの送信はgit pushで行う。

## 9. Gitに含めるもの・含めないもの

### 含める

- ソースコード
- posts内のMarkdown記事
- package.json
- package-lock.json
- .node-version
- READMEと学習メモ
- .gitignore

### 含めない

- node_modules：再インストールできる依存パッケージ
- .next：生成されたビルド結果
- .envなど：認証情報を含み得る環境変数ファイル
- .vercel：Vercelのローカル設定

.gitignoreは、未追跡のファイルをGit管理から除外する設定。
既にコミットしたファイルを、後から自動で履歴から消すものではない。

## 10. 今後使うコマンド

| コマンド | 意味 |
|---|---|
| npm run dev | Next.jsの開発サーバーを起動する |
| npm run lint | ESLintでコードを検査する |
| npm run build | 型チェックと本番用の生成処理を行う |
| npm run start | 生成済みの本番用成果物でサーバーを起動する |
| npm ci | lockファイルに基づいて依存関係をインストールする |
| git status | 変更とコミット準備の状態を確認する |
| git log --oneline | コミット履歴を簡潔に表示する |
| git push | コミットをリモートリポジトリへ送信する |

npm runは、package.jsonのscriptsに登録されたコマンドを実行する。

npm ciは、package-lock.jsonを利用し、
既存のnode_modulesを置き換えてインストールする。
package.jsonとlockファイルが整合していない場合はエラーになる。

## 11. 実装時に追加する学習項目

- ファイルの読み込み
- frontmatterの検証
- MarkdownからHTMLへの変換
- 記事一覧と日付順の並べ替え
- 動的ルートのslugとparams
- generateStaticParamsによる記事ページの静的生成
- HTML文字列をReactで表示する方法と注意点
- シンタックスハイライトのCSS
- 記事ごとのメタデータ

## 12. 実装したファイルと処理の対応

| ファイル | 役割 |
|---|---|
| src/lib/posts.ts | ファイルの読み込み、frontmatterの検証、HTML変換 |
| src/app/page.tsx | 記事一覧 |
| src/app/posts/[slug]/page.tsx | 記事詳細と静的生成対象の指定 |
| src/app/layout.tsx | 全ページ共通の枠 |
| src/app/not-found.tsx | 存在しないページの表示 |
| src/app/globals.css | 本文とコードのスタイル |
| posts/*.md | 記事データ |

### Node.jsのfsとpath

fsはファイルを扱うNode.js標準モジュール。
readdirSyncでフォルダ内の一覧、readFileSyncで本文を読む。

Sync付きの処理は、完了するまで次の処理を待つ同期処理。
今回は小規模な記事をビルド時に読むため使用している。

pathはファイルパスを組み立てる標準モジュール。
process.cwd()は、プログラムの現在の作業ディレクトリを返す。

これらはブラウザではなく、サーバー・ビルド側で使う。

### slugとファイル名

nextjs-app-router.mdのslugはnextjs-app-router。
対応するURLは/posts/nextjs-app-router。

小文字英数字とハイフンだけを許可し、実際に存在する記事だけを読む。

### frontmatterの検証

title・descriptionは空でない文字列。
dateは引用符付きのYYYY-MM-DDで、実在する日付。
tagsは空でない文字列の配列。

不正な記事はビルドで検出し、修正を促す。
本文のh1は許可せず、記事タイトルと見出し階層を揃える。

### 一覧の並べ替え

YYYY-MM-DD形式は、文字列比較で日付順に並べられる。
新しい日付を先にし、同日ならslug順にする。

### Promiseとawait

Promiseは、後で得られる処理結果を表すオブジェクト。
awaitは、その結果を待って値を受け取る構文。
awaitを使う関数にはasyncを指定する。

記事のHTML変換と、Next.jsのparams取得で使用している。

### params

動的ルートから渡される情報。
/posts/nextjs-app-routerならslugがnextjs-app-routerになる。

今回のNext.jsではparamsをPromiseとして受け取り、awaitで取り出す。

### generateStaticParams

ビルド時に作る記事のslug一覧を返す。
Next.jsがそれぞれの値で記事詳細ページを生成する。

dynamicParams = falseにより、一覧に含まれない記事URLは404にする。
新しい記事を公開するには再ビルドが必要。
今回の構成では、next.config.tsでcacheComponentsを無効にしている。<br>
Cache Components有効時にはdynamicParamsを指定できないため、<br>
記事URLをgenerateStaticParamsで列挙し、未登録URLを404にする構成に揃えた。

### generateMetadata

記事ごとのタイトルと説明文を設定する関数。
一覧とは別に、各記事に合う情報を提供する。

### notFound

存在しない記事ではNext.jsのnotFoundを呼ぶ。
not-found.tsxの画面が表示される。

### Link

Next.jsのリンクコンポーネント。
サイト内ページへの移動に使う。

### dangerouslySetInnerHTML

HTML文字列を、文字としてではなくHTMLとして表示するReactの指定。
通常の{post.html}では、HTMLタグも文字として表示される。

外部入力をそのまま渡すとXSSの原因になる。
XSSは、意図しないスクリプトなどをページへ混入させる攻撃。

今回は自作記事だけを扱い、remark-rehypeの標準設定で
Markdown内の生HTMLを通さない構成にしている。
rehype-rawやallowDangerousHtmlは有効にしていない。

この構成を、外部投稿を受け付けるサービスへそのまま流用しない。

### MarkdownのHTML変換

remarkでMarkdownを解析する。
remark-rehypeでHTML用の構造に変える。
rehype-highlightでコードの色分け用クラスを追加する。
rehype-stringifyでHTML文字列にする。

### Typographyとハイライト

proseクラスが記事全体の文字・余白・見出しを整える。
hljsから始まるCSSクラスが、コード内の色を指定する。
