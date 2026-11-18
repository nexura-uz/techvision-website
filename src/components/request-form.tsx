"use client";

import { Check, CircleCheck, HelpCircle, Plus, Wrench } from "lucide-react";
import { useActionState, useState } from "react";
import { type FormState, sendRequest } from "@/app/actions";
import type { ServiceGroup } from "@/lib/api";
import { Field, PhoneInput, SubmitButton } from "./form-parts";
import { ICONS, requestType } from "./service-cards";

const QUESTION = "question"; // the extra tile for anything else

/** A service request made by tapping (owner, 2026-11-18: regular customers, no writing when a choice will do):
 *  1. what is needed (a tile per service group, + "Boshqa savol"), 2. optionally the exact services (chips),
 *  3. name and phone. A note is optional, behind "+ Izoh qo'shish". The message is written from the choices.
 *  `groups` with one group: that group's page, step 1 is already chosen. */
export function RequestForm({ groups, initial }: { groups: ServiceGroup[]; initial?: string }) {
  const [state, action] = useActionState<FormState, FormData>(sendRequest, {});
  const fixed = groups.length === 1;
  const [slug, setSlug] = useState(fixed ? groups[0].slug : initial ?? "");
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState(false);
  const group = groups.find((g) => g.slug === slug);
  const bad = (field: string) => state.fields?.includes(field);
  const type = slug === QUESTION ? "question" : group ? requestType(group.icon) : "repair";
  const message = [group ? `${group.name}${picked.length ? `: ${picked.join(", ")}` : ""}` : slug === QUESTION ? "Savol" : ""].filter(Boolean).join("");

  if (state.done) {
    return (
      <div role="status" className="py-6 text-center">
        <CircleCheck className="mx-auto size-14 text-teal" aria-hidden />
        <p className="display mt-4 text-xl">So'rovingiz qabul qilindi</p>
        <p className="mt-2 text-muted">Tez orada qo'ng'iroq qilamiz.</p>
      </div>
    );
  }

  const tile = (active: boolean) =>
    `flex min-h-20 flex-col items-start justify-between gap-2 rounded-xl border p-3 text-left text-sm leading-tight font-semibold transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"}`;

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="type" value={type} />

      {!fixed && (
        <fieldset>
          <legend className="mb-3 font-semibold">1. Nima kerak?</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {groups.map((g) => {
              const Icon = ICONS[g.icon] ?? Wrench;
              return (
                <button key={g.id} type="button" aria-pressed={slug === g.slug} onClick={() => { setSlug(g.slug); setPicked([]); }} className={tile(slug === g.slug)}>
                  <Icon className={`size-5 ${slug === g.slug ? "text-teal" : ""}`} aria-hidden />{g.name}
                </button>
              );
            })}
            <button type="button" aria-pressed={slug === QUESTION} onClick={() => { setSlug(QUESTION); setPicked([]); }} className={tile(slug === QUESTION)}>
              <HelpCircle className={`size-5 ${slug === QUESTION ? "text-teal" : ""}`} aria-hidden />Boshqa savol
            </button>
          </div>
        </fieldset>
      )}

      {group && group.services.length > 0 && (
        <fieldset>
          <legend className="mb-1 font-semibold">{fixed ? "Qaysi xizmat kerak?" : "2. Aniqrog'i"} <span className="text-sm font-normal text-muted">(ixtiyoriy, bir nechtasini tanlash mumkin)</span></legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.services.map((s) => {
              const on = picked.includes(s.name);
              return (
                <button key={s.id} type="button" aria-pressed={on} onClick={() => setPicked((old) => (old.includes(s.name) ? old.filter((x) => x !== s.name) : [...old, s.name]))}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"}`}>
                  {on && <Check className="size-4 text-teal" aria-hidden />}{s.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {(slug || fixed) && (
        <fieldset className="grid gap-4">
          <legend className="mb-3 font-semibold">{fixed ? "Bog'lanish uchun" : group ? "3. Bog'lanish uchun" : "2. Bog'lanish uchun"}</legend>
          <div className={`grid gap-4 ${fixed ? "" : "sm:grid-cols-2"}`}>{/* a group's page has the form in a narrow column */}
            <Field label="Ismingiz" error={bad("name")}>
              <input name="name" required minLength={2} maxLength={255} autoComplete="name" defaultValue={state.values?.name} className="field" />
            </Field>
            <Field label="Telefon" error={bad("phone")}>
              <PhoneInput key={state.values?.phone} name="phone" defaultValue={state.values?.phone} invalid={bad("phone")} />
            </Field>
          </div>
          {note ? (
            <Field label="Izoh (ixtiyoriy)" error={bad("message")}>
              <textarea name="note" maxLength={1500} rows={3} autoFocus placeholder="Masalan: noutbuk yoqilmayapti" className="field" />
            </Field>
          ) : (
            <button type="button" onClick={() => setNote(true)} className="flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"><Plus className="size-4" aria-hidden /> Izoh qo'shish</button>
          )}
          {/* the choices as text; the server action adds the note after it */}
          <input type="hidden" name="message" value={message} />
          {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}
          <SubmitButton pending="Yuborilmoqda..." className="btn btn-primary btn-lg w-full">So'rov yuborish</SubmitButton>
          <p className="text-center text-sm text-muted">Usta qo'ng'iroq qilib, narx va muddatni aytadi.</p>
        </fieldset>
      )}
    </form>
  );
}
