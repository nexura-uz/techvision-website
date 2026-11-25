import { ImageIcon } from "lucide-react";

type Kind = "cpu" | "ram" | "nvme" | "ssd" | "hdd";

// shortcut: chosen by our category names, so renaming those categories in the admin turns the drawings off; switch to slugs if that happens
function kindOf(name: string, category?: string | null): Kind | null {
  const n = name.toLowerCase();
  if (category === "Protsessorlar") return "cpu";
  if (category === "Operativ xotira (RAM)") return "ram";
  if (category === "SSD va disklar") return /\bhdd\b|hard drive/.test(n) ? "hdd" : /nvme|\bm\.?2\b/.test(n) ? "nvme" : "ssd";
  return null;
}

const ticks = (from: number, to: number, step: number, line: (v: number) => string) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => line(from + i * step)).join(" ");

/** Line drawings, 160 × 160, in the current text colour. */
const DRAWINGS: Record<Kind, React.ReactNode> = {
  cpu: (
    <>
      <rect x="36" y="36" width="88" height="88" rx="6" />
      <rect x="50" y="50" width="60" height="60" rx="9" />
      <path d={[ticks(46, 114, 8, (v) => `M${v} 26v6M${v} 128v6M26 ${v}h6M128 ${v}h6`)].join(" ")} />
      <path d="M42 118l6-6" />
    </>
  ),
  ram: (
    <>
      <path d="M12 54h136v40h-66v6h-8v-6H12z" />
      {[22, 52, 90, 120].map((x) => <rect key={x} x={x} y="61" width="22" height="18" rx="1.5" />)}
      <path d={ticks(18, 70, 5, (v) => `M${v} 86v8`) + " " + ticks(90, 142, 5, (v) => `M${v} 86v8`)} />
    </>
  ),
  nvme: (
    <>
      <path d="M10 64h134a6 6 0 0 1 0 32H10v-12h4v-8h-4z" />
      <circle cx="146" cy="80" r="3.5" />
      <path d={ticks(14, 30, 4, (v) => `M${v} 66v4M${v} 90v4`)} />
      <rect x="38" y="70" width="20" height="20" rx="1.5" />
      <rect x="66" y="70" width="28" height="20" rx="1.5" />
      <rect x="102" y="70" width="28" height="20" rx="1.5" />
    </>
  ),
  ssd: (
    <>
      <rect x="30" y="30" width="100" height="94" rx="7" />
      <rect x="42" y="44" width="76" height="46" rx="3" />
      <path d="M46 124v6h40v-6M94 124v6h16v-6" />
      {[[38, 38], [122, 38], [38, 116], [122, 116]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" />)}
    </>
  ),
  hdd: (
    <>
      <rect x="34" y="18" width="92" height="124" rx="6" />
      <circle cx="80" cy="66" r="34" />
      <circle cx="80" cy="66" r="7" />
      <circle cx="110" cy="118" r="7" />
      <path d="M106 112L88 80" />
      {[[42, 26], [118, 26], [42, 134], [118, 134]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" />)}
    </>
  ),
};

const CAPTION: Record<Kind, string> = { cpu: "Protsessor", ram: "Operativ xotira", nvme: "M.2 NVMe SSD", ssd: "SSD", hdd: "HDD" };

/** What a product without a photo shows: a hairline drawing of the part (CPU, RAM, NVMe, SSD, HDD) on a soft grey spot,
 *  with a small caption, or a plain image icon. `className` sets the drawing's size. */
export function PartPlaceholder({ name, category, className = "w-2/5", caption = true }: { name: string; category?: string | null; className?: string; caption?: boolean }) {
  const kind = kindOf(name, category);
  if (!kind) return <ImageIcon className="absolute inset-0 m-auto size-10 text-ink/15" aria-hidden />;
  return (
    <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_45%,var(--color-stage)_0%,transparent_55%)]">
      <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
        className={`text-ink/45 [&_*]:[vector-effect:non-scaling-stroke] ${className}`}>
        {DRAWINGS[kind]}
      </svg>
      {caption && <span className="text-[10px] font-semibold tracking-[0.14em] text-ink/35 uppercase">{CAPTION[kind]}</span>}
    </span>
  );
}
