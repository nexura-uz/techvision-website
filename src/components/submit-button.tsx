"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/** Shows on a slow phone connection that the tap registered, and blocks a double order. */
export function SubmitButton({ children, pendingText, className, ...rest }: {
    children: ReactNode;
    pendingText?: string;
    className: string;
    name?: string;
    value?: string | number;
    "aria-label"?: string;
}) {
    const { pending } = useFormStatus();
    return (
        <button {...rest} disabled={pending} aria-busy={pending} className={`${className} disabled:cursor-wait disabled:opacity-60`}>
            {pending && pendingText ? pendingText : children}
        </button>
    );
}
