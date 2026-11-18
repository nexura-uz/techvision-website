import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Text } from "@/components/text";
import { getPage, getPages } from "@/lib/api";
import { date } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page.title, description: page.content.slice(0, 160), alternates: { canonical: `/pages/${page.slug}` } };
}

// delivery, warranty, returns, public offer, privacy: written in the admin; a page without text is a 404. A menu of
// all of them sits beside the text (on phones, above it), so customers move between them easily.
export default async function InfoPage({ params }: Props) {
  const slug = (await params).slug;
  const [page, pages] = await Promise.all([getPage(slug), getPages()]);
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: `/pages/${page.slug}`, label: page.title }]} />
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <nav aria-label="Ma'lumot" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 hidden text-sm font-bold lg:block">Ma'lumot</p>
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:grid lg:gap-0.5 lg:overflow-visible">
            {pages.map((p) => (
              <li key={p.slug} className="flex-none">
                <Link href={`/pages/${p.slug}`} aria-current={p.slug === page.slug ? "page" : undefined}
                  className={`flex min-h-10 items-center rounded-full px-4 text-sm whitespace-nowrap lg:rounded-lg lg:px-3 ${p.slug === page.slug ? "bg-ink font-semibold text-white" : "bg-stage lg:bg-transparent lg:hover:bg-stage"}`}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="min-w-0">
          <h1 className="text-2xl lg:text-[2rem]">{page.title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted">Yangilangan: {date(page.updated_at)}</p>
          <Text>{page.content}</Text>
        </article>
      </div>
    </div>
  );
}
