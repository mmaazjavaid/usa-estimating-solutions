"use client"

import { useState } from "react"
import { ChevronRight, ChevronUp } from "lucide-react"
import { CursorGlow } from "@/components/ui/cursor-glow"

const aboutUsGlowColors = {
  primary: "rgba(70, 70, 35, 0.5)",
  secondary: "rgba(58, 58, 30, 0.42)",
  tertiary: "rgba(45, 45, 25, 0.36)",
}

export function AboutUsContent() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const skills = [
    "Cost Estimating & Budgeting (Preliminary + detailed project cost planning)",
    "Quantity Takeoff / Material Quantification (accurate measurements of construction materials)",
    "Bid & Proposal Preparation (creating competitive and realistic bid estimates)",
    "Value Engineering & Cost Optimization (finding cost-saving alternatives without affecting quality)",
  ]

  const stats = [
    { value: "5+", label: "Years Of Experience" },
    { value: "100+", label: "Projects Done" },
    { value: "100+", label: "Satisfied Clients" },
    { value: "20+", label: "Certified Awards" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "\"USA Estimating Solutions is the best option for contractors continuously losing the proposals. The company's professionals will definitely help you win projects and increase your worth in the market. Just choose them!\"",
    },
    {
      name: "David Lee",
      text: "\"In my opinion, USA Estimating Solutions is the only precise and accurate estimates for your construction and software to ensure the accuracy of their estimates.\"",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "What types of construction estimating services do you offer?",
      answer:
        "We provide residential, commercial, and industrial estimating services, including preliminary estimates, bid estimates, trade-specific takeoffs, change orders, value engineering, and CPM scheduling support.",
    },
    {
      question: "Who do you work with?",
      answer:
        "Our services support general contractors, subcontractors, homebuilders, developers, architects, engineers, lenders, and investors across the United States.",
    },
    {
      question: "How long does it take to receive an estimate?",
      answer:
        "Most estimates are delivered within 24 to 48 hours, depending on project size, scope, and drawing completeness.",
    },
    {
      question: "Do you provide location-based pricing?",
      answer:
        "Yes. All estimates are prepared using location-specific labor and material pricing to reflect regional market conditions throughout the U.S.",
    },
    {
      question: "What do you need to get started?",
      answer:
        "Simply send us your drawings, specifications, project location, and bid deadline. We'll review the details and provide a clear quote and turnaround time.",
    },
    {
      question: "Are your services confidential?",
      answer:
        "Absolutely. All project data and documents are handled with strict confidentiality, and we are happy to sign NDAs upon request.",
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="min-h-screen bg-black text-white">
      <CursorGlow colors={aboutUsGlowColors} className="h-full w-full">
      <section className="px-6 pb-16 pt-20 md:px-12 lg:px-20">
        <h1 className="mb-6 text-center text-4xl font-bold md:text-5xl">About Us</h1>

        <h2 className="mb-8 text-center text-xl text-[#d9d9d9] md:text-2xl">
          Accurate estimates, Faster decisions, Smarter construction success.
        </h2>

        <p className="mx-auto max-w-5xl text-center text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
          USA Estimating Solutions delivers fast, accurate, and cost-effective
          estimating and consulting services for real estate development and
          construction projects across the United States. With 5+ years of AEC
          industry experience, we help developers, architects, and contractors
          make smarter decisions through detailed takeoffs, reliable estimates,
          scheduling, and cost control. Using modern technology and industry
          expertise, we provide dependable results with quick turnarounds so you
          can plan confidently, bid competitively, and stay on budget.
        </p>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="lg:w-1/2">
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">Our Skills</h2>
            <ul className="space-y-4">
              {skills.map((skill) => (
                <li key={skill} className="flex items-start gap-3">
                  <span className="mt-1 text-[#d9d9d9]/60">-</span>
                  <span className="text-sm text-[#d9d9d9]/80 md:text-base">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-2 text-4xl font-bold md:text-5xl">{stat.value}</div>
                  <div className="text-sm text-[#d9d9d9]/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          Proud to be a Trusted Partner
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-[#d9d9d9]/60 md:text-base">
          We measure our success of our customers and partners. By helping
          others win and grow we aspire to build a trusted firm.
        </p>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex gap-4 overflow-hidden">
            <div className="w-full flex-shrink-0 rounded-lg bg-[#1a1a1a] p-8 md:w-2/3">
              <h3 className="mb-4 text-lg font-semibold">{testimonials[currentTestimonial].name}</h3>
              <p className="text-sm leading-relaxed text-[#d9d9d9]/80">
                {testimonials[currentTestimonial].text}
              </p>
            </div>

            <div className="hidden w-1/3 flex-shrink-0 rounded-lg bg-[#1a1a1a] p-8 opacity-50 md:block">
              <h3 className="mb-4 text-lg font-semibold">
                {testimonials[(currentTestimonial + 1) % testimonials.length].name}
              </h3>
              <p className="line-clamp-4 text-sm leading-relaxed text-[#d9d9d9]/80">
                {testimonials[(currentTestimonial + 1) % testimonials.length].text}
              </p>
              {testimonials[(currentTestimonial + 1) % testimonials.length].rating ? (
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-teal-400">
                      *
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentTestimonial === index ? "bg-white" : "bg-[#d9d9d9]/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
            <div className="h-2 w-2 rounded-full bg-[#d9d9d9]/30" />
            <div className="h-2 w-2 rounded-full bg-[#d9d9d9]/30" />
          </div>

          <button
            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 rounded-full p-2 transition-colors hover:bg-[#1a1a1a]"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl rounded-2xl bg-[#111] p-8 md:p-12">
          <h2 className="mb-12 text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-3 text-sm font-semibold md:text-base">{faq.question}</h3>
                <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={scrollToTop}
              className="rounded-full border border-[#d9d9d9]/30 p-3 transition-colors hover:bg-[#1a1a1a]"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      </CursorGlow>
    </section>
  )
}
