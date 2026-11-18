import { Clock, MapPin, Phone, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import { type Store, mediaUrl } from "@/lib/api";
import { formatPhone, mapHref, telHref } from "@/lib/format";

/** Every active location: photo, address with a map link, phones, hours. The first is the main shop. */
export function StoreCards({ stores, className = "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }: { stores: Store[]; className?: string }) {
  return (
    <div className={className}>
      {stores.map((s, i) => (
        <article key={s.id} className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="relative aspect-[16/9] bg-paper">
            {s.image ? (
              <Image src={mediaUrl(s.image)} alt={s.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw" className="object-cover" />
            ) : (
              <StoreIcon className="absolute inset-0 m-auto size-10 text-line" aria-hidden />
            )}
            {i === 0 && stores.length > 1 && <span className="absolute top-2 left-2 rounded bg-ink px-2 py-0.5 text-xs font-semibold text-white">Asosiy do'kon</span>}
          </div>
          <div className="grid gap-2 p-4 text-sm [&_svg]:size-4 [&_svg]:flex-none [&_svg]:text-teal-deep">
            <h3 className="text-base font-bold">{s.name}</h3>
            <p className="flex gap-2"><MapPin aria-hidden />{[s.region, s.address].filter(Boolean).join(", ")}</p>
            {s.working_hours && <p className="flex gap-2"><Clock aria-hidden />{s.working_hours}</p>}
            {[s.phone, s.phone_2].filter(Boolean).map((p) => (
              <a key={p} href={telHref(p)} className="flex gap-2 font-semibold hover:underline"><Phone aria-hidden />{formatPhone(p)}</a>
            ))}
            <a href={mapHref(s)} target="_blank" rel="noreferrer" className="btn btn-outline mt-2">Xaritada ochish</a>
          </div>
        </article>
      ))}
    </div>
  );
}
