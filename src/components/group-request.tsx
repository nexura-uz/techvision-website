"use client";

import { Check, CircleCheck, Phone, Plus, ShieldCheck } from "lucide-react";
import { useActionState, useState } from "react";
import { type FormState, sendRequest } from "@/app/actions";
import type { ServiceGroup } from "@/lib/api";
import { Field, PhoneInput, SubmitButton } from "./form-parts";
import { requestType } from "./service-cards";

/** A service group's page: its services are ONE list that is tapped to choose (a tick, the warranty and the note on
 *  each), and beside it the request: what was chosen, name, phone, send. Nothing is listed twice (owner, 2026-11-18). */
export function GroupRequest({ group, phone }: { group: ServiceGroup; phone?: { href: string; label: string } }) {
  const [state, action] = useActionState<FormState, FormData>(sendRequest, {});
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState(false);
  const bad = (field: string) => state.fields?.includes(field);
  const toggle = (name: string) => setPicked((old) => (old.includes(name) ? old.filter((x) => x !== name) : [...old, name]));

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
      <input type="hidden" name="type" value={requestType(group.icon)} />
      <input type="hidden" name="message" value={`${group.name}${picked.length ? `: ${picked.join(", ")}` : ""}`} />

      <div>
        <p className="mb-3 text-sm text-muted">Kerakli xizmatni belgilang (bir nechtasini ham bo'ladi):</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {group.services.map((s) => {
            const on = picked.includes(s.name);
            return (
              <li key={s.id}>
                <button type="button" aria-pressed={on} onClick={() => toggle(s.name)}
                  className={`flex h-full w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${on ? "border-ink bg-stage" : "border-line hover:border-ink/40"}`}>
                  <span className={`mt-0.5 flex size-5 flex-none items-center justify-center rounded-md border ${on ? "border-ink bg-ink text-teal" : "border-ink/30"}`}>
                    {on && <Check className="size-3.5" aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{s.name}</span>
                    {s.note && <span className="mt-0.5 block text-sm text-muted">{s.note}</span>}
                    {s.warranty && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold ring-1 ring-line"><ShieldCheck className="size-3.5" aria-hidden /> Kafolat {s.warranty}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm text-muted">Narx va muddatni usta qurilmani tekshirgandan keyin aytadi.</p>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line p-5 lg:p-6">
          {state.done ? (
            <div role="status" className="py-4 text-center">
              <CircleCheck className="mx-auto size-12 text-teal" aria-hidden />
              <p className="display mt-3 text-lg">So'rovingiz qabul qilindi</p>
              <p className="mt-1 text-sm text-muted">Tez orada qo'ng'iroq qilamiz.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <p className="display text-lg">So'rov qoldirish</p>
                <p className="mt-1 text-sm text-muted">
                  {picked.length ? <>Tanlandi: <b className="text-ink">{picked.join(", ")}</b></> : "Xizmatni tanlang yoki shunchaki ism va telefonni yozing: usta o'zi so'raydi."}
                </p>
              </div>
              <Field label="Ismingiz" error={bad("name")}>
                <input name="name" required minLength={2} maxLength={255} autoComplete="name" defaultValue={state.values?.name} className="field" />
              </Field>
              <Field label="Telefon" error={bad("phone")}>
                <PhoneInput key={state.values?.phone} name="phone" defaultValue={state.values?.phone} invalid={bad("phone")} />
              </Field>
              {note ? (
                <Field label="Izoh (ixtiyoriy)">
                  <textarea name="note" maxLength={1500} rows={3} autoFocus placeholder="Masalan: noutbuk yoqilmayapti" className="field" />
                </Field>
              ) : (
                <button type="button" onClick={() => setNote(true)} className="flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"><Plus className="size-4" aria-hidden /> Izoh qo'shish</button>
              )}
              {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}
              <SubmitButton pending="Yuborilmoqda..." className="btn btn-primary btn-lg w-full">So'rov yuborish</SubmitButton>
            </div>
          )}
        </div>
        {phone && <a href={phone.href} className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold hover:underline"><Phone className="size-4" aria-hidden /> yoki qo'ng'iroq qiling: {phone.label}</a>}
      </div>
    </form>
  );
}
