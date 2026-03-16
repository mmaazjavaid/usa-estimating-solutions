import { Mail, MapPin, Phone } from "lucide-react"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { ContactQuoteForm } from "@/components/contact/contact-quote-form"
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
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="mt-4 text-xl text-[#d9d9d9]/85 md:text-2xl">
              Need any expert? Let us know how we can help.
            </p>
          </div>

          <div className="mx-auto mb-16 max-w-3xl rounded-2xl border border-white/15 p-6 md:p-8">
            <h2 className="mb-6 text-center text-4xl font-bold">Get A Quote</h2>

            <ContactQuoteForm />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
            <ContactCard
              icon={<MapPin className="h-12 w-12" strokeWidth={1.6} />}
              title="Visit Us"
              line1={address}
            />
            <ContactCard
              icon={<Phone className="h-12 w-12" strokeWidth={1.6} />}
              title="Call Us"
              line1={primaryPhone}
              withDivider
            />
            <ContactCard
              icon={<Mail className="h-12 w-12" strokeWidth={1.6} />}
              title="Email Us"
              line1={primaryEmail}
              withDivider
            />
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

function ContactCard({
  icon,
  title,
  line1,
  withDivider = false,
}: {
  icon: React.ReactNode
  title: string
  line1: string
  withDivider?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center text-center ${
        withDivider ? "md:border-l md:border-white/20" : ""
      } px-4`}
    >
      <div className="mb-4 text-white">{icon}</div>
      <h3 className="mb-3 text-3xl font-semibold">{title}</h3>
      <p className="text-xl text-[#d9d9d9]/85">{line1}</p>
    </div>
  )
}
