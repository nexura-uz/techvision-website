import { BadgeCheck, Star } from "lucide-react";

// SAMPLE ONLY: shows the owner what the reviews section will look like (2026-11-18). These reviews are made up, so the
// block renders only in development; the live site never shows them. Real reviews (customers who received an order,
// approved by staff) will fill the same layout once that system is built.
const SAMPLE = [
  { name: "Aziz", date: "12.11.2026", stars: 5, text: "Buyurtma ertasi kuni keldi, hammasi tekshirib berildi. Yaxshi xizmat." },
  { name: "Dilnoza", date: "03.11.2026", stars: 5, text: "Telefonda hammasini tushuntirishdi, narxi ham kelishilgandek bo'ldi." },
  { name: "Sardor", date: "28.10.2026", stars: 4, text: "Mahsulot yaxshi, faqat qutisi biroz ezilgan edi. Ichi joyida." },
];
const COUNTS = [12, 3, 1, 0, 0]; // 5…1 stars

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`${size} ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-line"}`} aria-hidden />)}
    </span>
  );
}

export function ReviewsSample() {
  if (process.env.NODE_ENV === "production") return null;
  const total = COUNTS.reduce((a, b) => a + b, 0);
  const average = COUNTS.reduce((sum, n, i) => sum + n * (5 - i), 0) / total;
  return (
    <section className="wrap mt-14 lg:mt-20" aria-label="Sharhlar (namuna)">
      <div className="mb-4 flex flex-wrap items-center gap-3 lg:mb-6">
        <h2 className="text-xl lg:text-[1.75rem]">Mijozlar sharhlari</h2>
        <span className="badge rounded-full bg-amber-100 text-amber-800">NAMUNA: faqat ishlab chiqishda ko'rinadi</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:gap-10">
        <div className="rounded-2xl border border-line p-5 lg:self-start">
          <p className="text-4xl font-bold">{average.toFixed(1)}</p>
          <Stars value={average} size="size-5" />
          <p className="mt-1 text-sm text-muted">{total} ta sharh</p>
          <ul className="mt-4 grid gap-1.5 text-sm">
            {COUNTS.map((n, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-3 text-muted">{5 - i}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-stage"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${(n / total) * 100}%` }} /></span>
                <span className="w-5 text-right text-muted">{n}</span>
              </li>
            ))}
          </ul>
          <button type="button" disabled className="btn btn-outline mt-5 w-full disabled:opacity-60">Sharh yozish</button>
          <p className="mt-2 text-center text-xs text-muted">Faqat bu mahsulotni sotib olganlar yoza oladi</p>
        </div>
        <ul className="grid content-start gap-3">
          {SAMPLE.map((r) => (
            <li key={r.name} className="rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex size-9 items-center justify-center rounded-full bg-stage font-semibold">{r.name[0]}</span>
                <span className="font-semibold">{r.name}</span>
                <span className="flex items-center gap-1 text-xs text-teal-deep"><BadgeCheck className="size-4 text-teal" aria-hidden /> Xarid qilgan</span>
                <span className="ml-auto text-xs text-muted">{r.date}</span>
              </div>
              <div className="mt-3"><Stars value={r.stars} /></div>
              <p className="mt-2 text-[0.95rem] leading-relaxed">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
