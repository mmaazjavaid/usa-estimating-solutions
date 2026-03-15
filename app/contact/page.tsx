import { Mail, MapPin, Phone } from "lucide-react"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
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

            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Project Type" name="projectType" />
              </div>

              <Field label="Upload A Project" name="uploadProject" />

              <div>
                <label
                  htmlFor="details"
                  className="mb-2 block text-lg font-semibold text-[#d9d9d9]"
                >
                  Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  className="w-full rounded-lg border border-white/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none transition focus:border-white/40"
                />
              </div>

              <button
                type="button"
                className="inline-flex rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Submit a plan
              </button>
            </form>
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

function Field({
  label,
  name,
  type = "text",
}: {
  label: string
  name: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-lg font-semibold text-[#d9d9d9]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-lg border border-white/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none transition focus:border-white/40"
      />
    </div>
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
