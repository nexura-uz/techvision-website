"use client";

import Link from "next/link";

/** Something failed while showing a page (e.g. the API did not answer): say so plainly and offer a retry. */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="wrap mx-auto max-w-xl py-16 text-center lg:py-24">
      <h1 className="text-2xl">Xatolik yuz berdi</h1>
      <p className="mt-2 text-muted">Sahifani ochib bo'lmadi. Birozdan keyin qayta urinib ko'ring yoki bizga qo'ng'iroq qiling.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">Qayta urinish</button>
        <Link href="/" className="btn btn-outline">Bosh sahifa</Link>
      </div>
    </div>
  );
}
