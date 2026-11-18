"use client";

import { CircleCheck, X, Zap } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { type QuickState, quickOrder } from "@/app/actions";
import { Field, PhoneInput, SubmitButton } from "./form-parts";

/** "Bir klikda xarid": a small window asking only the name and the phone; the shop calls back for the rest. */
export function QuickOrder({ id, name, price }: { id: number; name: string; price: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<QuickState, FormData>(quickOrder, {});
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);
  const bad = (f: string) => state.fields?.includes(f);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-outline w-full"><Zap className="size-4" aria-hidden /> Bir klikda xarid</button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 sm:items-center" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="quick-title" className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <p id="quick-title" className="display text-lg">Bir klikda xarid</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Yopish" className="-mt-1 -mr-1 flex size-10 flex-none items-center justify-center rounded-full hover:bg-stage"><X className="size-5" /></button>
            </div>
            <p className="mt-1 text-sm text-muted">{name} · <b className="text-ink">{price}</b></p>
            {state.order ? (
              <div role="status" className="mt-6 text-center">
                <CircleCheck className="mx-auto size-12 text-teal" aria-hidden />
                <p className="mt-3 font-semibold">Buyurtma #{state.order} qabul qilindi</p>
                <p className="mt-1 text-sm text-muted">Tez orada qo'ng'iroq qilib, yetkazib berish va to'lovni kelishib olamiz.</p>
                <button type="button" onClick={() => setOpen(false)} className="btn btn-primary mt-5 w-full">Yaxshi</button>
              </div>
            ) : (
              <form action={action} className="mt-5 grid gap-4">
                <input type="hidden" name="product" value={id} />
                <Field label="Ismingiz" error={bad("full_name")}>
                  <input name="full_name" required minLength={2} maxLength={255} autoComplete="name" defaultValue={state.values?.full_name} autoFocus className={`field ${bad("full_name") ? "border-red-600" : ""}`} />
                </Field>
                <Field label="Telefon" error={bad("phone")}>
                  <PhoneInput name="phone" defaultValue={state.values?.phone} invalid={bad("phone")} />
                </Field>
                {state.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
                <SubmitButton pending="Yuborilmoqda..." className="btn btn-primary w-full">Buyurtma berish</SubmitButton>
                <p className="text-center text-xs text-muted">Manzil va to'lovni qo'ng'iroqda kelishamiz.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
