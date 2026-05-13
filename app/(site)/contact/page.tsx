import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { ContactHero } from "@/components/contact/contact-hero"
import { getContactData, getSeoMetadataByPath } from "@/lib/cms"


export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/contact")) ?? {}
}

export default async function ContactPage() {
  const contactData = await getContactData()
  const primaryPhone = contactData.phones[0] ?? "+(716) 226-1302"
  const primaryEmail =
    contactData.emails[0] ?? "info@usaestimatingsolutions.com"
  const address = contactData.address || "Brooklyn, NY 11222, USA"

  return (
    <>
      <Header />
      <main className="bg-black pt-20 text-white">
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactHero
            address={address}
            primaryPhone={primaryPhone}
            primaryEmail={primaryEmail}
          />
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
