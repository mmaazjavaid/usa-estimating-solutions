"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ContactQuoteForm } from "@/components/contact/contact-quote-form"

const contactGlowColors = {
  primary: "rgba(75, 40, 130, 0.48)",
  secondary: "rgba(60, 32, 105, 0.40)",
  tertiary: "rgba(48, 25, 85, 0.34)",
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

type ContactHeroProps = {
  address: string
  primaryPhone: string
  primaryEmail: string
}

export function ContactHero({ address, primaryPhone, primaryEmail }: ContactHeroProps) {
  return (
    <CursorGlow colors={contactGlowColors} className="h-full w-full">
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
    </CursorGlow>
  )
}
