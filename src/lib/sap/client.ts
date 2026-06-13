/**
 * SAP B1 Service Layer base HTTP client.
 * Manages session (B1SESSION cookie) with auto-login and auto-retry on 401.
 *
 * Env vars: SAP_B1_URL, SAP_B1_USER, SAP_B1_PASS, SAP_B1_COMPANY
 * SAP_B1_URL must end with the API version path, e.g.:
 *   https://sap-host:50000/b1s/v2/
 */

interface Session {
  cookie: string
  expiresAt: number
}

let session: Session | null = null
let loginPromise: Promise<void> | null = null

// Strip trailing slash so we can always do `${BASE}/${path}`
const SAP_BASE = (process.env.SAP_B1_URL ?? '').replace(/\/+$/, '')
const SAP_USER = process.env.SAP_B1_USER!
const SAP_PASS = process.env.SAP_B1_PASS!
const SAP_DB   = process.env.SAP_B1_COMPANY!

async function login(): Promise<void> {
  if (loginPromise) {
    return loginPromise
  }

  loginPromise = (async () => {
    try {
      const res = await fetch(`${SAP_BASE}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: SAP_USER,
          Password: SAP_PASS,
          CompanyDB: SAP_DB,
        }),
      })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`SAP login failed [${res.status}]: ${body}`)
      }

      // Extract cookies cleanly, supporting both standard multi-header setups and single combined headers
      const setCookieHeaders = res.headers.getSetCookie
        ? res.headers.getSetCookie()
        : [res.headers.get('set-cookie') ?? '']

      const parsedCookies: string[] = []
      for (const headerValue of setCookieHeaders) {
        if (!headerValue) continue
        // Split in case single combined header is used
        const parts = headerValue.split(/,(?=[^;]+;)/)
        for (const part of parts) {
          const cookiePair = part.split(';')[0].trim()
          if (cookiePair.startsWith('B1SESSION=') || cookiePair.startsWith('ROUTEID=')) {
            parsedCookies.push(cookiePair)
          }
        }
      }

      const cookie = parsedCookies.length > 0
        ? parsedCookies.join('; ')
        : ''

      // Robust fallback if cookies were formatted unexpectedly but login succeeded
      if (!cookie || !cookie.includes('B1SESSION=')) {
        const rawSet = res.headers.get('set-cookie') ?? ''
        const fallback = rawSet.split(';')[0].trim()
        if (fallback.startsWith('B1SESSION=')) {
          session = {
            cookie: fallback,
            expiresAt: Date.now() + 29 * 60 * 1000 // Fallback to 29 minutes
          }
          return
        }
      }

      const data = (await res.json()) as { SessionTimeout: number }
      const timeoutSec = data.SessionTimeout || 30 * 60 // Fallback to 30 minutes
      
      session = {
        cookie,
        expiresAt: Date.now() + (timeoutSec - 60) * 1000,
      }
    } finally {
      loginPromise = null
    }
  })()

  return loginPromise
}

export async function sapFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!session || Date.now() >= session.expiresAt) {
    await login()
  }

  // Normalize: strip leading slash from path since SAP_BASE already has no trailing slash
  const normalizedPath = path.replace(/^\/+/, '')

  const doRequest = () =>
    fetch(`${SAP_BASE}/${normalizedPath}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Cookie: session!.cookie,
        ...(options.headers ?? {}),
      },
    })

  const res = await doRequest()

  // Session expired mid-request: clear broken session, re-login once, and retry
  if (res.status === 401) {
    session = null // Force new login
    await login()
    return doRequest()
  }

  return res
}
