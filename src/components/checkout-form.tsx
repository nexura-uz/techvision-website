"use client";

import { Plus, Store, Truck } from "lucide-react";
import { useActionState, useState } from "react";
import { type FormState, placeOrder } from "@/app/actions";
import { Field, PhoneInput, SubmitButton } from "./form-parts";

/** Checkout made simple (owner, 2026-11-18): name and phone, then one tap: pick it up at a shop or have it delivered.
 *  Only delivery asks for the region and the address; a note is optional, behind "+ Izoh qo'shish". */
export function CheckoutForm({ regions, stores }: { regions: { id: number; name: string }[]; stores: { id: number; name: string; address: string }[] }) {
  const [state, action] = useActionState<FormState, FormData>(placeOrder, {});
  const v = state.values ?? {};
  const [how, setHow] = useState(v.delivery ?? (stores.length ? `pickup:${stores[0].name}` : "delivery"));
  const [note, setNote] = useState(Boolean(v.comment));
  const bad = (field: string) => state.fields?.includes(field);
  const option = (on: boolean) => `flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${on ? "border-ink bg-ink text-white" : "border-line hover:border-ink/40"}`;

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4">
        <Field label="Ismingiz" error={bad("full_name")}>
          <input name="full_name" required minLength={2} maxLength={255} autoComplete="name" defaultValue={v.full_name} className="field" />
        </Field>
        <Field label="Telefon" error={bad("phone")}>
          <PhoneInput key={v.phone} name="phone" defaultValue={v.phone} invalid={bad("phone")} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Qanday olasiz?</legend>
        <input type="hidden" name="delivery" value={how} />
        <div className="grid gap-2">
          {stores.map((s) => (
            <button key={s.id} type="button" aria-pressed={how === `pickup:${s.name}`} onClick={() => setHow(`pickup:${s.name}`)} className={option(how === `pickup:${s.name}`)}>
              <Store className={`mt-0.5 size-5 flex-none ${how === `pickup:${s.name}` ? "text-teal" : ""}`} aria-hidden />
              <span className="min-w-0"><b className="block text-sm">Do'kondan olib ketaman{stores.length > 1 ? `: ${s.name.replace(/^TECHVISION\s*/i, "")}` : ""}</b>
                <span className={`block truncate text-xs ${how === `pickup:${s.name}` ? "text-white/60" : "text-muted"}`}>{s.address}</span></span>
            </button>
          ))}
          <button type="button" aria-pressed={how === "delivery"} onClick={() => setHow("delivery")} className={option(how === "delivery")}>
            <Truck className={`mt-0.5 size-5 flex-none ${how === "delivery" ? "text-teal" : ""}`} aria-hidden />
            <span><b className="block text-sm">Yetkazib berish</b><span className={`text-xs ${how === "delivery" ? "text-white/60" : "text-muted"}`}>Barcha viloyatlarga</span></span>
          </button>
        </div>
      </fieldset>

      {how === "delivery" && (
        <div className="grid gap-4">
          <Field label="Viloyat" error={bad("region_id")}>
            <select key={v.region_id} name="region_id" required defaultValue={v.region_id ?? ""} className="field">
              <option value="" disabled>Tanlang</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Manzil (ixtiyoriy)">
            <input name="address" maxLength={500} autoComplete="street-address" defaultValue={v.address} placeholder="Shahar, ko'cha, uy" className="field" />
          </Field>
        </div>
      )}

      {note ? (
        <Field label="Izoh (ixtiyoriy)">
          {/* focused only after "+ Izoh qo'shish" was pressed (not when the form comes back with an error): typing goes straight in */}
          <textarea name="comment" maxLength={1000} rows={3} defaultValue={v.comment} autoFocus={!v.comment} className="field" />
        </Field>
      ) : (
        <button type="button" onClick={() => setNote(true)} className="flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"><Plus className="size-4" aria-hidden /> Izoh qo'shish</button>
      )}

      {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}
      <SubmitButton pending="Yuborilmoqda..." className="btn btn-primary btn-lg w-full">Buyurtma berish</SubmitButton>
      <p className="text-center text-xs text-muted">Hozir to'lov yo'q: xodimimiz qo'ng'iroq qilib, buyurtmani tasdiqlaydi.</p>
    </form>
  );
}
