import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
};

const postsDirectory = path.join(process.cwd(), "posts");
const slugPattern    = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// 記事ファイルを読み込んで、メタデータと本文を返す。
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const slug = entry.name.slice(0, -3);

      if (!slugPattern.test(slug)) {
        throw new Error(`記事ファイル名が不正です: ${entry.name}`);
      }

      return slug;
    })
    .sort();
}

function readPost(slug: string) {
  if (!slugPattern.test(slug) || !getPostSlugs().includes(slug)) {
    return null;
  }

  const filePath = path.join(postsDirectory, `${slug}.md`);
  const source   = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  function invalid(field: string): never {
    throw new Error(`${slug}.md: ${field}を確認してください`);
  }

  const title: unknown       = data.title;
  const date: unknown        = data.date;
  const tags: unknown        = data.tags;
  const description: unknown = data.description;

  if (typeof title !== "string" || !title.trim()) {
    invalid("title");
  }

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    invalid("date（引用符で囲んだYYYY-MM-DD）");
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    invalid("date（実在する日付）");
  }

  if (!Array.isArray(tags)) {
    invalid("tags");
  }

  const validatedTags = tags.map((tag: unknown) => {
    if (typeof tag !== "string" || !tag.trim()) {
      invalid("tags（空でない文字列の一覧）");
    }

    return tag.trim();
  });

  if (typeof description !== "string" || !description.trim()) {
    invalid("description");
  }

  // 記事タイトルはページ側のh1にするため、本文はh2以下から始める。
  const tree = remark().parse(content);

  if (tree.children.some((node) => node.type === "heading" && node.depth === 1)) {
    invalid("本文の見出し（#ではなく##以下を使用）");
  }

  const summary: PostSummary = {
    slug,
    title: title.trim(),
    date,
    tags: [...new Set(validatedTags)],
    description: description.trim(),
  };

  return { summary, content };
}

export function getAllPosts(): PostSummary[] {
  return getPostSlugs()
    .map((slug) => {
      const post = readPost(slug);

      if (!post) {
        throw new Error(`記事が見つかりません: ${slug}`);
      }

      return post.summary;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export async function getPost(slug: string) {
  const post = readPost(slug);

  if (!post) {
    return null;
  }

  // remarkでMarkdownの構造を解析する
  const result = await remark()
    .use(remarkRehype) // html用の構造に変換
    .use(rehypeHighlight, { detect: false }) // コードの色分け用クラスを追加する
    .use(rehypeStringify) // HTML文字列にする
    .process(post.content);

  return {
    ...post.summary,
    html: String(result),
  };
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
