import { ShieldAlert } from "lucide-react";

// remote help over AnyDesk (owner, 2026-11-18): how it goes, and the warning that protects customers from AnyDesk scams
const STEPS = [
  ["So'rov qoldirasiz", "yoki qo'ng'iroq qilasiz"],
  ["AnyDesk ID ni aytasiz", "dasturni o'rnatishga yordam beramiz"],
  ["Masofadan tuzatamiz", "siz ekranda kuzatib turasiz"],
];

export function RemoteSteps({ dark = false }: { dark?: boolean }) {
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map(([title, text], i) => (
          <li key={title} className={`flex items-start gap-3 rounded-xl p-4 ${dark ? "bg-white/5" : "bg-stage"}`}>
            <span className={`flex size-8 flex-none items-center justify-center rounded-full text-sm font-bold ${dark ? "bg-teal text-ink" : "bg-ink text-teal"}`}>{i + 1}</span>
            <span className="leading-tight"><b className="block">{title}</b><span className={`text-sm ${dark ? "text-white/60" : "text-muted"}`}>{text}</span></span>
          </li>
        ))}
      </ol>
      <p className={`mt-3 flex items-start gap-2 text-sm ${dark ? "text-white/70" : "text-muted"}`}>
        <ShieldAlert className={`mt-0.5 size-4 flex-none ${dark ? "text-teal" : ""}`} aria-hidden />
        Ulanishdan oldin bizning raqamimizga qo'ng'iroq qiling. AnyDesk ID ni boshqa hech kimga bermang.
      </p>
    </div>
  );
}
