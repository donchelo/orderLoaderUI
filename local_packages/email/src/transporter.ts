import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

export interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
  from?: string
}

function loadFromEnv(): SmtpConfig {
  const host = process.env.SMTP_HOST ?? process.env.EMAIL_SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? process.env.EMAIL_SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER ?? process.env.EMAIL_USER
  const pass = process.env.SMTP_PASS ?? process.env.EMAIL_PASS

  const missing = Object.entries({ host, user, pass })
    .filter(([, v]) => !v)
    .map(([k]) => k.toUpperCase())

  if (missing.length) {
    throw new Error(`@tama/email: faltan variables de entorno: ${missing.join(", ")}`)
  }

  return {
    host: host!,
    port,
    user: user!,
    pass: pass!,
    from: process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? user!,
  }
}

export function createTransporter(config?: SmtpConfig): Transporter {
  const cfg = config ?? loadFromEnv()
  const secure = cfg.port === 465
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure,
    auth: { user: cfg.user, pass: cfg.pass },
    ...(!secure && { tls: { ciphers: "SSLv3" } }),
  })
}

export function getFrom(config?: SmtpConfig): string {
  return config?.from ?? process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? process.env.EMAIL_USER ?? ""
}
