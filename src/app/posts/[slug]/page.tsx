import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPostSlugs } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post     = await getPost(slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post     = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
      <Link href="/" className="text-sm font-semibold text-teal-700 hover:underline">
        ← 記事一覧へ
      </Link>

      <article className="mt-10">
        <header className="border-b border-slate-200 pb-8">
          <time dateTime={post.date} className="text-sm text-slate-500">
            {formatDate(post.date)}
          </time>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-5 leading-8 text-slate-600">{post.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="タグ">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div
          className="prose prose-slate mt-10 max-w-none break-words prose-headings:tracking-tight prose-a:text-teal-700 prose-pre:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  );
}
