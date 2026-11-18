import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Sahifa yo'li">
      <ol className="flex flex-wrap items-center gap-x-1 py-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-x-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            <Link href={item.href} className="inline-flex min-h-8 items-center hover:text-ink hover:underline">{item.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
