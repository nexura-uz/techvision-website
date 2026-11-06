"use client";

import { useActionState } from "react";
import { placeOrder, type OrderState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Region } from "@/lib/types";

function FieldError({ messages }: { messages?: string[] }) {
    return messages?.[0] ? <p role="alert" className="mt-1 text-sm font-medium text-red-700">{messages[0]}</p> : null;
}

export function CheckoutForm({ regions }: { regions: Region[] }) {
    const [state, action] = useActionState<OrderState, FormData>(placeOrder, {});
    return (
        <form action={action} className="flex flex-col gap-4">
            <label className="font-medium">
                Ismingiz
                <input name="full_name" required minLength={2} autoComplete="name" defaultValue={state.values?.full_name} className="field mt-1 font-normal" />
                <FieldError messages={state.errors?.full_name} />
            </label>
            <label className="font-medium">
                Telefon
                <input name="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="+998 XX XXX XX XX" defaultValue={state.values?.phone} className="field mt-1 font-normal" />
                <FieldError messages={state.errors?.phone} />
            </label>
            <label className="font-medium">
                Viloyat
                <select key={state.values?.region} name="region" required defaultValue={state.values?.region ?? ""} className="field mt-1 font-normal">
                    <option value="" disabled>Tanlang</option>
                    {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                </select>
                <FieldError messages={state.errors?.region} />
            </label>
            {state.formError && <p role="alert" className="bg-paper p-3 font-medium text-red-700">{state.formError}</p>}
            <SubmitButton pendingText="Yuborilmoqda..." className="btn btn-primary !w-full">Buyurtma berish</SubmitButton>
            <p className="text-sm text-muted">To'lov onlayn emas: xodimimiz qo'ng'iroq qilib buyurtmani tasdiqlaydi.</p>
        </form>
    );
}
