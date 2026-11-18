import { Search } from "lucide-react";
import Link from "next/link";

/** A missing page: say so plainly, and offer the three ways on (search, the catalog, the services). */
export default function NotFound() {
  return (
    <div className="wrap mx-auto max-w-xl py-16 text-center lg:py-24">
      <p className="display text-7xl text-ink/50 lg:text-8xl" aria-hidden>404</p>
      <h1 className="mt-4 text-2xl">Sahifa topilmadi</h1>
      <p className="mt-2 text-muted">Bu sahifa o'chirilgan yoki manzil noto'g'ri yozilgan. Kerakli mahsulotni qidirib ko'ring:</p>
      <form action="/catalog" role="search" className="mx-auto mt-6 flex max-w-md">
        <input name="q" type="search" required aria-label="Mahsulot qidirish" placeholder="Noutbuk, monitor, printer..." className="field rounded-r-none" />
        <button className="btn btn-primary rounded-l-none px-4" aria-label="Qidirish"><Search className="size-5" aria-hidden /></button>
      </form>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/catalog" className="btn btn-outline">Katalog</Link>
        <Link href="/service" className="btn btn-outline">Servis</Link>
        <Link href="/" className="btn btn-outline">Bosh sahifa</Link>
      </div>
    </div>
  );
}
