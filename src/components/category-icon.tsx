import { Cctv, Cpu, Headphones, LayoutGrid, Laptop, Monitor, MonitorSpeaker, Printer, Router, ShoppingBag } from "lucide-react";

// an icon per top category (by the slugs of the 9-group tree); any other category gets the grid icon
const ICONS: Record<string, typeof Laptop> = {
  noutbuklar: Laptop, kompyuterlar: MonitorSpeaker, monitorlar: Monitor, "komplektlovchi-qismlar": Cpu, periferiya: Headphones,
  "printerlar-va-orgtexnika": Printer, "kuzatuv-kameralari": Cctv, "tarmoq-va-quvvat": Router, aksessuarlar: ShoppingBag,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? LayoutGrid;
  return <Icon className={className} aria-hidden />;
}
