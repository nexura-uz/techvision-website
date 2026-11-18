import { AppWindow, Building2, Cctv, ChevronRight, Cpu, Fan, MemoryStick, Printer, ScreenShare, Wifi, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ServiceGroup, mediaUrl } from "@/lib/api";

// the API's icon keys (app/content.py ICONS)
export const ICONS: Record<string, typeof Wrench> = {
  wrench: Wrench, fan: Fan, memory: MemoryStick, app: AppWindow, cpu: Cpu, printer: Printer, cctv: Cctv, wifi: Wifi, building: Building2, remote: ScreenShare,
};

// which request form type a group's "So'rov qoldirish" opens with
export const requestType = (icon: string) => (icon === "cctv" ? "camera" : icon === "cpu" ? "pc_build" : "repair");

/** The service groups as cards. Dark (the home page band): icon, name, the card line. Light (the service page): icon,
 *  name and the first services, so people see at once what is included. Both open the group's page. */
export function ServiceCards({ groups, dark = false }: { groups: ServiceGroup[]; dark?: boolean }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 ${dark ? "lg:grid-cols-3 2xl:grid-cols-5" : "lg:grid-cols-3"}`}>
      {groups.map((g) => {
        const Icon = ICONS[g.icon] ?? Wrench;
        return (
          <li key={g.id}>
            <Link href={`/service/${g.slug}`} className={`group flex h-full overflow-hidden rounded-2xl border transition-colors ${dark ? "border-white/10 bg-white/5 hover:border-teal/60" : "border-line bg-white hover:border-ink/30"}`}>
              {g.image && (
                <span className="relative w-28 flex-none sm:w-32">
                  <Image src={mediaUrl(g.image)} alt="" fill sizes="128px" className="object-cover" />
                </span>
              )}
              <span className="flex flex-1 flex-col p-4 lg:p-5">
                {!g.image && (dark
                  ? <Icon className="mb-3 size-7 text-teal" aria-hidden />
                  : <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-stage"><Icon className="size-5" aria-hidden /></span>)}
                <span className="flex items-center justify-between gap-2 leading-5 font-semibold">
                  {g.name} <ChevronRight className={`size-4 flex-none transition-transform group-hover:translate-x-0.5 ${dark ? "text-teal" : ""}`} aria-hidden />
                </span>
                {dark ? (
                  g.summary && <span className="mt-1 hidden text-sm text-white/60 sm:block">{g.summary}</span>
                ) : (
                  <span className="mt-2 hidden gap-1 text-sm text-muted sm:grid">
                    {g.services.slice(0, 3).map((s) => <span key={s.id} className="truncate">· {s.name}</span>)}
                  </span>
                )}
                <span className={`mt-auto pt-3 text-xs ${dark ? "text-white/65" : "hidden font-medium text-ink sm:block"}`}>
                  {dark ? `${g.services.length} ta xizmat` : g.services.length > 3 ? `Yana ${g.services.length - 3} ta xizmat →` : "Batafsil →"}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
