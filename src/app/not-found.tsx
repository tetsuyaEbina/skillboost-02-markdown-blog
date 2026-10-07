import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-bold text-teal-700">404</p>
      <h1 className="mt-4 text-3xl font-bold">記事が見つかりません</h1>
      <p className="mt-5 text-slate-600">URLを確認するか、記事一覧からお探しください。</p>
      <Link href="/" className="mt-8 inline-block font-semibold text-teal-700">
        記事一覧へ戻る
      </Link>
    </div>
  );
}
