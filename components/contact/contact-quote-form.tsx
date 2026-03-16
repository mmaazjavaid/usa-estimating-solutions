"use client"

import { FormEvent, useState } from "react"

type SubmitState = "idle" | "submitting" | "success" | "error"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  details: "",
}

export function ContactQuoteForm() {
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("submitting")
    setMessage("")

    try {
      const formData = new FormData()
      formData.set("name", form.name)
      formData.set("email", form.email)
      formData.set("phone", form.phone)
      formData.set("projectType", form.projectType)
      formData.set("details", form.details)

      for (const file of files) {
        formData.append("projectFiles", file)
      }

      const response = await fetch("/api/public/contact/submit", {
        method: "POST",
        body: formData,
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit your request.")
      }

      setState("success")
      setMessage("Your request was sent successfully.")
      setForm(initialForm)
      setFiles([])
      event.currentTarget.reset()
    } catch (error) {
      setState("error")
      setMessage(
        error instanceof Error ? error.message : "Unable to submit your request."
      )
    }
  }

  const isSubmitting = state === "submitting"

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={form.name}
          required
          onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          required
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          required
          onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
        />
        <Field
          label="Project Type"
          name="projectType"
          value={form.projectType}
          required
          onChange={(value) =>
            setForm((prev) => ({ ...prev, projectType: value }))
          }
        />
      </div>

      <div>
        <label
          htmlFor="projectFiles"
          className="mb-2 block text-lg font-semibold text-[#d9d9d9]"
        >
          Upload A Project
        </label>
        <input
          id="projectFiles"
          name="projectFiles"
          type="file"
          multiple
          className="w-full rounded-lg border border-white/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-white/20 focus:border-white/40"
          onChange={(event) =>
            setFiles(event.target.files ? Array.from(event.target.files) : [])
          }
        />
        <p className="mt-2 text-xs text-[#d9d9d9]/70">
          You can select one or multiple files.
        </p>
      </div>

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
          value={form.details}
          required
          onChange={(event) =>
            setForm((prev) => ({ ...prev, details: event.target.value }))
          }
          className="w-full rounded-lg border border-white/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none transition focus:border-white/40"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit a plan"}
      </button>

      {message ? (
        <p
          className={`text-sm ${
            state === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  value,
  required = false,
  onChange,
}: {
  label: string
  name: string
  type?: string
  value: string
  required?: boolean
  onChange: (value: string) => void
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
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none transition focus:border-white/40"
      />
    </div>
  )
}
