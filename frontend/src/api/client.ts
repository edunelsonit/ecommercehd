export type ApiError = {
  message: string
  status: number
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  '/api'
).replace(/\/$/, '')

export async function apiRequest<T>(
  path: string,
  token?: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String(payload.message)
        : typeof payload === 'object' && payload !== null && 'error' in payload
          ? String(payload.error)
          : 'Request failed'

    throw { message, status: response.status } satisfies ApiError
  }

  return payload as T
}

export { API_BASE_URL }
