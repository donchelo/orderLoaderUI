import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Keep nodemailer and @react-pdf/renderer in Node.js runtime (not bundled by webpack)
  // Required for server-side PDF generation and SMTP email on Vercel
  serverExternalPackages: ['nodemailer', '@react-pdf/renderer'],
}

export default nextConfig
