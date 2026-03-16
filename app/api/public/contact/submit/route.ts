import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getContactData } from "@/lib/cms"

export const runtime = "nodejs"

const MAX_TOTAL_FILE_BYTES = 25 * 1024 * 1024

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_")
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const name = asString(formData.get("name"))
    const email = asString(formData.get("email"))
    const phone = asString(formData.get("phone"))
    const projectType = asString(formData.get("projectType"))
    const details = asString(formData.get("details"))

    if (!name || !email || !phone || !projectType || !details) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      )
    }

    const uploadedFiles = formData
      .getAll("projectFiles")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    const totalBytes = uploadedFiles.reduce((sum, file) => sum + file.size, 0)
    if (totalBytes > MAX_TOTAL_FILE_BYTES) {
      return NextResponse.json(
        { error: "Total attachment size must be less than 25MB." },
        { status: 413 }
      )
    }

    const contactData = await getContactData()

    const smtpHost = requiredEnv("SMTP_HOST")
    const smtpPort = Number(process.env.SMTP_PORT ?? "587")
    const smtpUser = requiredEnv("SMTP_USER")
    const smtpPass = requiredEnv("SMTP_PASS")
    const smtpSecure = process.env.SMTP_SECURE === "true"

    const toEmail =
      process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
      contactData.emails[0] ||
      "info@usaestimatingsolutions.com"

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const submittedAt = new Date().toISOString()
    const formattedSummary = [
      "USA Estimating Solutions - Contact Submission",
      "============================================",
      `Submitted At: ${submittedAt}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Project Type: ${projectType}`,
      "",
      "Details:",
      details,
      "",
      `Files Attached: ${uploadedFiles.length}`,
    ].join("\n")

    const attachments: Array<{
      filename: string
      content: Buffer | string
      contentType?: string
    }> = [
      {
        filename: `contact-request-${Date.now()}.txt`,
        content: formattedSummary,
        contentType: "text/plain; charset=utf-8",
      },
    ]

    for (const file of uploadedFiles) {
      const bytes = await file.arrayBuffer()
      attachments.push({
        filename: sanitizeFilename(file.name || "attachment"),
        content: Buffer.from(bytes),
        contentType: file.type || "application/octet-stream",
      })
    }

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || smtpUser,
      to: toEmail,
      replyTo: email,
      subject: `New Contact Request: ${name}`,
      text: formattedSummary,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Details:</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(details)}</pre>
        <p><strong>Project Files:</strong> ${uploadedFiles.length}</p>
        <p>The form summary and uploaded files are attached.</p>
      `,
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit contact form."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
