import { Phone, ScreenShare, Send } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RemoteSteps } from "@/components/remote-steps";
import { RequestForm } from "@/components/request-form";
import { ServiceCards } from "@/components/service-cards";
import { getServices, getSettings } from "@/lib/api";
import { formatPhone, telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Servis va ta'mirlash",
  description: "Noutbuk va kompyuter ta'miri, tozalash, upgrade, Windows, kompyuter yig'ish, printer xizmatlari, kuzatuv kameralari, tarmoq va biznes uchun xizmat. Marg'ilon.",
  alternates: { canonical: "/service" },
};

const STEPS = [
  ["So'rov qoldirasiz", "Kerakli xizmatni tanlang, ism va telefonni yozing."],
  ["Qo'ng'iroq qilamiz", "Usta muammoni so'rab, narxni taxminan aytadi."],
  ["Tekshiramiz", "Qurilmani ko'rib, aniq narx va muddatni kelishamiz."],
  ["Tayyor", "Ishni bajarib, tekshirib topshiramiz."],
];

// old links (banners, the home page) say ?type=camera / repair / pc_build: open the form on the matching group
const TYPE_ICON: Record<string, string> = { repair: "wrench", camera: "cctv", pc_build: "cpu" };

type Props = { searchParams: Promise<{ group?: string; type?: string }> };

export default async function ServicePage({ searchParams }: Props) {
  const [{ group, type }, settings, groups] = await Promise.all([searchParams, getSettings(), getServices()]);
  const initial = group ?? groups.find((g) => g.icon === TYPE_ICON[type ?? ""])?.slug;
  const total = groups.reduce((n, g) => n + g.services.length, 0);
  const remote = groups.find((g) => g.icon === "remote");
  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap pb-10 lg:pb-12 [&_nav_a]:text-white/60">
          <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/service", label: "Servis" }]} />
          <p className="eyebrow mt-2 !text-teal">Servis markazi</p>
          <h1 className="mt-2 max-w-3xl text-[1.75rem] leading-tight lg:text-[2.5rem]">Kompyuter va noutbuk uchun barcha xizmatlar</h1>
          <p className="mt-3 text-white/70">{groups.length} yo'nalish · {total} xizmat · narxni usta tekshirgandan keyin aytadi</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#request" className="btn btn-primary btn-lg">So'rov qoldirish</a>
            {settings.phone && <a href={telHref(settings.phone)} className="btn btn-ghost-dark btn-lg"><Phone className="size-4" aria-hidden /> {formatPhone(settings.phone)}</a>}
          </div>
        </div>
      </section>

      <div className="wrap">
        {remote && (
          // the owner's favourite service: remote help, shown before everything else
          <section aria-label={remote.name} className="band-dark mt-8 grid gap-6 rounded-2xl p-6 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-10 lg:p-8">
            <div>
              <span className="flex size-12 items-center justify-center rounded-xl bg-teal text-ink"><ScreenShare className="size-6" aria-hidden /></span>
              <h2 className="mt-4 text-2xl">{remote.name}</h2>
              <p className="mt-2 text-white/70">{remote.summary}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/service/${remote.slug}#request`} className="btn btn-primary">So'rov qoldirish</Link>
                <Link href={`/service/${remote.slug}`} className="btn btn-ghost-dark">Batafsil</Link>
              </div>
            </div>
            <RemoteSteps dark />
          </section>
        )}

        <h2 className="mt-12 mb-5 text-xl lg:text-[1.75rem]">Nima qilamiz</h2>
        <ServiceCards groups={groups} />

        <h2 className="mt-14 mb-5 text-xl lg:text-[1.75rem]">Qanday ishlaymiz</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line p-5">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-ink font-bold text-teal">{i + 1}</span>
              <span><b className="block">{title}</b><span className="mt-1 block text-sm text-muted">{text}</span></span>
            </li>
          ))}
        </ol>

        <section id="request" className="mt-14 grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
          <div>
            <h2 className="text-xl lg:text-[1.75rem]">So'rov qoldiring</h2>
            <p className="mt-3 text-muted">Tanlang, ism va telefonni yozing: biz qo'ng'iroq qilamiz. Yozish shart emas.</p>
            <div className="mt-6 grid gap-3">
              {settings.phone && <a href={telHref(settings.phone)} className="btn btn-outline justify-start"><Phone className="size-4" aria-hidden /> {formatPhone(settings.phone)}</a>}
              {settings.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noreferrer" className="btn btn-outline justify-start"><Send className="size-4" aria-hidden /> Telegramda yozish</a>}
            </div>
          </div>
          <div className="rounded-2xl border border-line p-5 lg:p-8">
            <RequestForm groups={groups} initial={initial} />
          </div>
        </section>
      </div>
    </>
  );
}
