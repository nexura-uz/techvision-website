import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** A home page block: an optional small label over the title, the title, an optional "all of them" link, content. */
export function Section({ title, eyebrow, link, id, children }: { title: string; eyebrow?: string; link?: { href: string; label: string }; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="wrap mt-14 lg:mt-20">
      <div className="mb-4 flex items-end justify-between gap-4 lg:mb-6">
        <div>
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h2 className="text-xl lg:text-[1.75rem]">{title}</h2>
        </div>
        {link && (
          <Link href={link.href} className="flex items-center gap-0.5 text-sm font-semibold whitespace-nowrap text-teal-deep hover:underline">
            {link.label} <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
