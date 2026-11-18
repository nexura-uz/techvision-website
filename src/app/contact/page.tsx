import { Clock, MapPin, MessageCircle, Navigation, Phone, Send, Wrench } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getSettings, getStores } from "@/lib/api";
import { formatPhone, mapHref, telHref } from "@/lib/format";
import { jsonLd, storesLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Do'konlar va aloqa",
  description: "TECHVISION do'konlari manzillari, xaritada joylashuvi, telefon raqamlari va ish vaqti.",
  alternates: { canonical: "/contact" },
};

function Way({ href, icon, title, text, external = false }: { href: string; icon: ReactNode; title: string; text: string; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex min-w-0 items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-ink/30 lg:p-5">
      <span className="flex size-12 flex-none items-center justify-center rounded-xl bg-ink text-teal [&_svg]:size-5">{icon}</span>
      <span className="min-w-0 leading-tight"><b className="block">{title}</b><span className="mt-0.5 block truncate text-sm text-muted">{text}</span></span>
    </a>
  );
}

/** The ways to reach the shop first (big, one tap), then every store with its address, hours, phones and map. */
export default async function ContactPage() {
  const [stores, settings] = await Promise.all([getStores(), getSettings()]);
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storesLd(stores, settings))} />
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/contact", label: "Aloqa" }]} />
      <h1 className="text-2xl lg:text-[2rem]">Aloqa</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {settings.phone && <Way href={telHref(settings.phone)} icon={<Phone />} title="Qo'ng'iroq qilish" text={formatPhone(settings.phone)} />}
        {settings.telegram_url && <Way href={settings.telegram_url} icon={<Send />} title="Telegramda yozish" text="Tez javob beramiz" external />}
        {settings.instagram_url && <Way href={settings.instagram_url} icon={<MessageCircle />} title="Instagram" text="Yangi mahsulotlar va ishlarimiz" external />}
        <Way href="/service#request" icon={<Wrench />} title="Ta'mir yoki kamera" text="So'rov qoldiring, usta qo'ng'iroq qiladi" />
      </div>

      <h2 className="mt-12 mb-5 text-xl lg:text-[1.75rem]">{stores.length > 1 ? "Do'konlarimiz" : "Do'konimiz"}</h2>
      <div className={`grid gap-4 ${stores.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {stores.map((s) => (
          <section key={s.id} className={`overflow-hidden rounded-2xl border border-line ${stores.length > 1 ? "" : "lg:grid lg:grid-cols-[24rem_1fr]"}`}>
            <div className="grid content-start gap-3 p-5 text-sm lg:p-6 [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none">
              <h3 className="text-lg font-bold">{s.name}</h3>
              <p className="flex gap-2.5"><MapPin aria-hidden />{[s.region, s.address].filter(Boolean).join(", ")}</p>
              {s.working_hours && <p className="flex gap-2.5"><Clock aria-hidden />{s.working_hours}</p>}
              {[s.phone, s.phone_2].filter(Boolean).map((p) => (
                <a key={p} href={telHref(p)} className="flex gap-2.5 font-semibold hover:underline"><Phone aria-hidden />{formatPhone(p)}</a>
              ))}
              <a href={mapHref(s)} target="_blank" rel="noreferrer" className="btn btn-primary mt-2 justify-self-start"><Navigation aria-hidden /> Yo'l ko'rsatish</a>
            </div>
            {s.latitude && s.longitude ? (
              <iframe title={`${s.name}: xarita`} loading="lazy" className="block h-64 w-full border-t border-line bg-stage lg:h-full lg:min-h-80 lg:border-t-0"
                src={`https://yandex.uz/map-widget/v1/?ll=${s.longitude},${s.latitude}&z=16&pt=${s.longitude},${s.latitude},pm2rdm`} />
            ) : null}
          </section>
        ))}
        {stores.length === 0 && <p className="rounded-2xl bg-stage p-6 text-muted">Do'kon manzillari tez orada qo'shiladi.</p>}
      </div>
    </div>
  );
}
