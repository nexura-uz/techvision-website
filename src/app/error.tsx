"use client";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className="wrap py-12">
            <h1 className="h1">Sahifa yuklanmadi</h1>
            <p className="mt-3 text-lg">Serverga ulanib bo'lmadi. Bir ozdan keyin qayta urinib ko'ring.</p>
            <button type="button" onClick={reset} className="btn btn-primary mt-5">Qayta urinish</button>
        </div>
    );
}
