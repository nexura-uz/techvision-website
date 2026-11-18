// +998939756883 → +998 93 975 68 83
export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "").replace(/^998/, "");
  return d.length === 9 ? `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}` : phone;
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

// 7274000 → "7 274 000 so'm"; prices come already rounded from the API
export const som = (amount: number) => `${amount.toLocaleString("ru-RU")} so'm`;

export const mapHref = (s: { latitude: string | null; longitude: string | null; address: string }) =>
  s.latitude && s.longitude
    ? `https://yandex.uz/maps/?pt=${s.longitude},${s.latitude}&z=16&l=map`
    : `https://yandex.uz/maps/?text=${encodeURIComponent(s.address)}`;

// "2026-11-17T09:30:00+00:00" → "17.11.2026" (Tashkent time)
export const date = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { timeZone: "Asia/Tashkent" });
