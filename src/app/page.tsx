import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/posts"; //@/は今回、src/を表す

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <section aria-labelledby="blog-title">
        <p className="text-xs font-bold tracking-[0.2em] text-teal-700">
          ENGINEERING NOTES
        </p>
        <h1
          id="blog-title"
          className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          作って、理解して、記録する。
        </h1>
        <p className="mt-6 max-w-2xl leading-8 text-slate-600">
          Web開発の仕組みや、実装して学んだことを残す技術ブログ。
          Markdownで書いた記事を、静的なページとして公開しています。
        </p>
        <p className="mt-6 text-sm text-slate-500">{posts.length} articles</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <time dateTime={post.date} className="text-sm text-slate-500">
                {formatDate(post.date)}
              </time>
              <h2 className="mt-3 text-xl leading-8 font-bold">
                <Link
                  href={`/posts/${post.slug}`}
                  className="transition hover:text-teal-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {post.description}
              </p>
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
