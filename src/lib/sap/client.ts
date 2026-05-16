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

// Strip trailing slash so we can always do `${BASE}/${path}`
const SAP_BASE = (process.env.SAP_B1_URL ?? '').replace(/\/+$/, '')
const SAP_USER = process.env.SAP_B1_USER!
const SAP_PASS = process.env.SAP_B1_PASS!
const SAP_DB   = process.env.SAP_B1_COMPANY!

async function login(): Promise<void> {
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
  const setCookie = res.headers.get('set-cookie') ?? ''
  const cookie = setCookie.split(';')[0] // 'B1SESSION=...'
  const data = (await res.json()) as { SessionTimeout: number }
  session = {
    cookie,
    expiresAt: Date.now() + (data.SessionTimeout - 60) * 1000,
  }
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

  // Session expired mid-request: re-login once and retry
  if (res.status === 401) {
    await login()
    return doRequest()
  }

  return res
}
