import type { Metadata } from "next";
import { PageHead } from "@/components/section";
import { api, getSettings, getSocialLinks } from "@/lib/api";
import { formatPhone, jsonLd, mapHref, storeJsonLd, telHref } from "@/lib/site";
import type { Contact } from "@/lib/types";

export const metadata: Metadata = { title: "Aloqa", description: "TECHVISION do'konlari manzili, telefon raqamlari va ish vaqti.", alternates: { canonical: "/contact" } };

export default async function Page() {
    const [contacts, settings, socials] = await Promise.all([api<Contact[]>("contacts/"), getSettings(), getSocialLinks()]);
    return (
        <div className="wrap">
            <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storeJsonLd(settings, socials))} />
            <PageHead title="Aloqa" />
            {contacts.length === 0 && settings.phone && <a href={telHref(settings.phone)} className="text-lg font-medium">{formatPhone(settings.phone)}</a>}
            <div className="flex flex-col gap-10">
                {contacts.map((contact) => (
                    <section key={contact.id} className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                        <div>
                            <h2 className="h2">{contact.store_name || contact.region_details.name}</h2>
                            <p className="mt-2 text-lg">{contact.region_details.name}, {contact.address}</p>
                            {settings.working_hours && <p className="text-muted">{settings.working_hours}</p>}
                            {[contact.phone_1, contact.phone_2].filter(Boolean).map((phone) => (
                                <a key={phone} href={telHref(phone)} className="flex min-h-11 items-center text-lg font-medium hover:underline">{formatPhone(phone)}</a>
                            ))}
                            <a href={mapHref(contact)} target="_blank" rel="noreferrer" className="btn btn-secondary my-4">Xaritada ochish</a>
                        </div>
                        <iframe
                            title={`${contact.store_name || contact.address}: xarita`}
                            loading="lazy"
                            className="h-72 w-full border-0 bg-paper lg:h-96"
                            src={`https://yandex.uz/map-widget/v1/?ll=${contact.longitude},${contact.latitude}&z=15&pt=${contact.longitude},${contact.latitude},pm2rdm`}
                        />
                    </section>
                ))}
            </div>
        </div>
    );
}
