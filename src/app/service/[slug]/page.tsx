import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RemoteSteps } from "@/components/remote-steps";
import { GroupRequest } from "@/components/group-request";
import { ICONS } from "@/components/service-cards";
import { Text } from "@/components/text";
import { getServiceGroup, getServices, getSettings, mediaUrl } from "@/lib/api";
import { formatPhone, telHref } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getServiceGroup((await params).slug);
  return {
    title: `${g.name} Marg'ilonda`,
    description: [g.summary, g.services.map((s) => s.name).join(", ")].filter(Boolean).join(" ").slice(0, 160),
    alternates: { canonical: `/service/${g.slug}` },
    openGraph: { images: g.image ? [mediaUrl(g.image)] : undefined },
  };
}

export default async function ServiceGroupPage({ params }: Props) {
  const [g, all, settings] = await Promise.all([getServiceGroup((await params).slug), getServices(), getSettings()]);
  const Icon = ICONS[g.icon] ?? ICONS.wrench;
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/service", label: "Servis" }, { href: `/service/${g.slug}`, label: g.name }]} />
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
        {/* every service area, the current one in black: a sticky list on desktop, a row of pills on phones */}
        <nav aria-label="Xizmat yo'nalishlari" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 hidden text-sm font-bold lg:block">Xizmatlar</p>
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:grid lg:gap-0.5 lg:overflow-visible">
            {all.map((x) => {
              const XIcon = ICONS[x.icon] ?? ICONS.wrench;
              const on = x.id === g.id;
              return (
                <li key={x.id} className="flex-none">
                  <Link href={`/service/${x.slug}`} aria-current={on ? "page" : undefined}
                    className={`flex min-h-10 items-center gap-2.5 rounded-full px-3.5 text-sm whitespace-nowrap lg:rounded-lg lg:px-3 ${on ? "bg-ink font-semibold text-white" : "bg-stage lg:bg-transparent lg:hover:bg-stage"}`}>
                    <XIcon className={`size-4 flex-none ${on ? "text-teal" : "text-muted"}`} aria-hidden />{x.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="flex size-14 flex-none items-center justify-center rounded-2xl bg-ink"><Icon className="size-7 text-teal" aria-hidden /></span>
            <div className="min-w-0">
              <h1 className="text-2xl leading-tight lg:text-[2rem]">{g.name}</h1>
              {g.summary && <p className="mt-1 text-muted">{g.summary}</p>}
            </div>
          </div>
          {g.image && (
            <div className="relative mt-6 aspect-[3/1] overflow-hidden rounded-2xl bg-stage">
              <Image src={mediaUrl(g.image)} alt="" fill priority sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
            </div>
          )}
          {g.icon === "remote" && <div className="mt-6"><RemoteSteps /></div>}
          <div id="request" className="mt-6 scroll-mt-28">
            <GroupRequest group={g} phone={settings.phone ? { href: telHref(settings.phone), label: formatPhone(settings.phone) } : undefined} />
          </div>
          {g.description && <div className="mt-10"><Text>{g.description}</Text></div>}
        </div>
      </div>
    </div>
  );
}
