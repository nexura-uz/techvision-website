"use client";

import { type ReactNode, useState } from "react";
import { useFormStatus } from "react-dom";

/** A submit button that says it is working, so nobody presses twice. */
/** `label`: the accessible name when the button shows only an icon. */
export function SubmitButton({ children, pending, className = "btn btn-primary", label }: { children: ReactNode; pending: string; className?: string; label?: string }) {
  const status = useFormStatus();
  return <button disabled={status.pending} aria-label={label} title={label} className={`${className} disabled:opacity-60`}>{status.pending ? pending : children}</button>;
}

// the 9 digits after +998, shown as "93 975 68 83"
const format = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");

/** Every phone is Uzbek: +998 is fixed and only the 9 digits are typed (a pasted full number also works).
 *  The form sends the 9 digits as `name`. */
export function PhoneInput({ name, defaultValue = "", invalid }: { name: string; defaultValue?: string; invalid?: boolean }) {
  const [digits, setDigits] = useState(defaultValue);
  return (
    <div className={`field flex items-center gap-1 p-0 pl-3 focus-within:border-teal-deep ${invalid ? "border-red-600" : ""}`}>
      <span className="text-muted">+998</span>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required
        aria-invalid={invalid}
        placeholder="90 123 45 67"
        value={format(digits)}
        onChange={(e) => {
          let d = e.target.value.replace(/\D/g, "");
          if (d.length > 9 && d.startsWith("998")) d = d.slice(3);
          setDigits(d.slice(0, 9));
        }}
        className="min-h-11 flex-1 bg-transparent pr-3 outline-none"
        pattern="\d{2} \d{3} \d{2} \d{2}"
        title="9 ta raqam: 90 123 45 67"
      />
      <input type="hidden" name={name} value={digits} />
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold">
      {label}
      <div className="font-normal">{children}</div>
      {error && <span className="text-sm font-medium text-red-700">Tekshirib qayta kiriting.</span>}
    </label>
  );
}
