"use client";

/** The root layout itself reads the API, so an outage there needs its own bare page. */
export default function GlobalError({ reset }: { reset: () => void }) {
    return (
        <html lang="uz">
            <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1rem" }}>
                <h1>TECHVISION: sahifa yuklanmadi</h1>
                <p>Serverga ulanib bo'lmadi. Bir ozdan keyin qayta urinib ko'ring.</p>
                <button type="button" onClick={reset}>Qayta urinish</button>
            </body>
        </html>
    );
}
