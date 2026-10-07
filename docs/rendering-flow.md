# Markdownブログ：記事から公開ページになるまで

## 1. 理解した全体像

このブログでは、記事をMarkdown（.md）で書き、
画面をReact・TypeScript（.tsx）で記述している。

これらをビルドで処理し、
ブラウザが表示できるHTML・CSS・JavaScriptなどを公開前に生成する。

静的生成とは、閲覧される前にページを生成しておく方式。
記事の更新を公開側へ反映するには、再ビルドが必要になる。

## 2. 登場するファイル

| ファイル | 役割 |
|---|---|
| posts/*.md | 記事の管理情報と本文 |
| src/lib/posts.ts | 記事ファイルの読み込み・検証・HTML変換 |
| src/app/page.tsx | 記事一覧の画面 |
| src/app/posts/[slug]/page.tsx | 記事詳細の画面と、事前生成する記事の指定 |
| src/app/layout.tsx | ページ共通の枠 |
| src/app/globals.css | 本文・カード・コードなどの見た目 |
| postcss.config.mjs | Tailwind CSSを処理する設定 |

## 3. 記事ファイルを見つける流れ

記事一覧のページでは、最初に次を実行する。

```tsx
const posts = getAllPosts();
```

getAllPostsは、src/lib/posts.tsにある関数。

その中でgetPostSlugsを呼び、記事の名前を取得する。

```ts
getPostSlugs()
```

getPostSlugsは、次の処理で実際のpostsフォルダを調べる。

```ts
fs.readdirSync(postsDirectory, { withFileTypes: true })
```

取得した一覧から、ファイルであり、名前が.mdで終わるものだけを残す。

```ts
.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
```

末尾の.mdを取り除き、記事の識別名にする。

```ts
const slug = entry.name.slice(0, -3);
```

例えば、次のファイルがあれば、

```text
first-post.md
second-post.md
image.png
```

返す値は次になる。

```ts
["first-post", "second-post"]
```

記事名をコード内に手動で列挙しているのではない。
フォルダを調べて、記事ファイルを見つけている。

## 4. 記事1本を読む流れ

getAllPostsは、取得したslugごとにreadPostを呼ぶ。

```ts
readPost("first-post")
```

readPostは、slugの形式と記事の存在を確認し、
読むファイルのパスを作る。

```ts
const filePath = path.join(postsDirectory, `${slug}.md`);
```

次にファイルの全文を文字列として読む。

```ts
const source = fs.readFileSync(filePath, "utf8");
```

gray-matterで管理情報と本文を分ける。

```ts
const { data, content } = matter(source);
```

| 値 | 内容 |
|---|---|
| data | title・date・tags・description |
| content | Markdown本文 |

タイトル・日付・タグなどを検証し、
一覧用のsummaryと本文のcontentを返す。

```ts
return { summary, content };
```

## 5. 一覧画面を作る流れ

getAllPostsは全記事のsummaryを集め、
日付の新しい順に並べて返す。

一覧のpage.tsxは、その結果を受け取る。

```tsx
const posts = getAllPosts();
```

mapで記事情報を1件ずつ取り出し、カードにする。

```tsx
{posts.map((post) => (
  <article key={post.slug}>
    <h2>{post.title}</h2>
  </article>
))}
```

一覧では本文全体をHTMLへ変換しない。
タイトル・日付・タグ・説明文を使う。

記事のリンク先はslugから作る。

```tsx
<Link href={`/posts/${post.slug}`}>
  {post.title}
</Link>
```

first-postなら、リンク先は/posts/first-postになる。

## 6. 詳細画面を作る流れ

詳細ページを担当するファイルは次。

```text
src/app/posts/[slug]/page.tsx
```

[slug]は、URLの変化する部分を受け取る指定。
パラメータ名slugは、このフォルダ名に対応している。

ページでは、Next.jsから渡されたparamsを受け取る。

```tsx
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post     = await getPost(slug);

  // 記事の画面を返す
}
```

getPostはreadPostで記事を読み、
今度は本文をHTMLへ変換する。

```ts
const result = await remark()
  .use(remarkRehype)
  .use(rehypeHighlight, { detect: false })
  .use(rehypeStringify)
  .process(post.content);
```

| 処理 | 役割 |
|---|---|
| remark | Markdownを解析する |
| remark-rehype | HTML用の構造へ変換する |
| rehype-highlight | コードの色分け用クラスを追加する |
| rehype-stringify | HTML文字列へ変換する |

例えばMarkdownの見出しは、

```markdown
## 見出し
```

次のHTMLになる。

```html
<h2>見出し</h2>
```

getPostは、管理情報とHTMLをまとめて返す。

詳細ページは、タイトルなどをJSXへ埋め込み、
本文のHTMLをdangerouslySetInnerHTMLで挿入する。

```tsx
<div dangerouslySetInnerHTML={{ __html: post.html }} />
```

挿入するHTMLの安全性には注意が必要。
今回は自作記事を対象とし、Markdown内の生HTMLを通さない構成にしている。

## 7. なぜビルドが必要なのか

Markdownが存在し、プログラムから読めることと、
公開用のページが生成済みであることは別。

今回のビルドでは、次を行う。

- TypeScript・JSXを変換する
- 記事を読み、本文をHTMLへ変換する
- Reactの画面と共通レイアウトからページを生成する
- Tailwindなどからブラウザ用CSSを生成する
- 本番用の成果物を作る

つまり、Markdownは記事の原稿、
TSXは画面の構成、
ビルドはそれらを公開用ページにする工程。

npm run devは、編集しながら確認する開発用サーバー。
npm run buildは、本番用の成果物を生成する処理。

## 8. generateStaticParamsは何をするのか

[slug]のフォルダだけでは、
Next.jsに事前生成する記事の一覧は伝わらない。

記事の取得元はMarkdown、DB、外部APIなど、アプリによって異なる。
Next.jsが自動でpostsフォルダを記事の保存場所と判断するわけではない。

今回、その一覧を渡すために書いたのが次の関数。

```tsx
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}
```

返す値の例：

```ts
[
  { slug: "first-post" },
  { slug: "second-post" }
]
```

この関数自身はHTMLを作らない。
「このslugのページを事前生成してほしい」とNext.jsへ伝える。

## 9. generateStaticParamsからPostPageへどうつながるのか

今回、理解しにくかったのは、
2つの関数をつなぐ処理が自分のファイルに見えないこと。

橋渡しはNext.jsが担当している。

ビルド時の流れ：

1. Next.jsがgenerateStaticParamsを呼ぶ。
2. 関数がslug一覧を返す。
3. Next.jsが各slugの情報をparamsとしてページへ渡す。
4. ページがgetPost(slug)で記事を取得する。
5. Next.js・Reactが返された画面からページを生成する。

説明用に単純化すると、次のような関係になる。
実際のNext.js内部コードそのものではない。

```tsx
const articles = generateStaticParams();

for (const article of articles) {
  const page = (
    <PostPage params={Promise.resolve(article)} />
  );

  // Next.js・Reactがpageをレンダリングし、成果物を生成する
}
```

接続部分のイメージはここ。

```tsx
<PostPage params={Promise.resolve({ slug: "first-post" })} />
```

受け取る側では、

```tsx
const { slug } = await params;
```

によってfirst-postを取り出す。

generateStaticParamsが直接PostPageを呼ぶのではない。
Next.jsが結果を受け取り、ページへ渡している。

これは今回のビルド時の説明であり、
すべてのページで常にこの順番になるという意味ではない。

## 10. export defaultとPropsの役割

### export default

export default自体に、自動実行する機能はない。
ファイルの代表として外部へ提供する指定。

App Routerでは、Next.jsがpage.tsxのdefault exportを
ページコンポーネントとして使うルールになっている。

PostPageという関数名は、自分たちが付けた名前。
ArticlePageなどに変更しても、default exportなら同じ役割になる。

generateStaticParamsは、Next.jsが認識する決められた名前。

### Props

```ts
type Props = {
  params: Promise<{ slug: string }>;
};
```

これは、受け取る情報の形をTypeScriptへ説明する型。

Propsが値を作ったり、関数を呼んだりするわけではない。
Next.jsが渡す情報の形に合わせて、私たちが型を書いている。

## 11. 公開後と記事更新

今回の本番構成では、記事を開くたびに
Markdownを読み直してHTMLへ変換する必要はない。

ビルド時に生成したページを提供する。

記事を変更する場合：

1. Markdownを追加・編集する。
2. 変更をコミットする。
3. GitHubへpushする。
4. Vercelが再ビルドする。
5. 新しい成果物が公開される。

MacでMarkdownを編集しただけでは、公開サイトは変わらない。

## 12. 理解したことを一文で説明する

Markdownの記事とTSXの画面構成を使い、
ビルド時に公開用ページを生成するブログ。

generateStaticParamsで作る記事の一覧をNext.jsへ渡し、
Next.jsが各記事の情報をページのparamsへ渡して生成を進める。
