import Link from "next/link";

export default function NotFound() {
    return (
        <div className="wrap py-12">
            <h1 className="h1">Bunday sahifa yo'q</h1>
            <p className="mt-3 text-lg">Mahsulot sotuvdan olingan yoki manzil noto'g'ri yozilgan.</p>
            <Link href="/categories" className="btn btn-primary mt-5">Katalogni ko'rish</Link>
        </div>
    );
}
