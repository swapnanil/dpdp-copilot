const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (secret) return secret

  if (process.env.NODE_ENV !== 'production') {
    return process.env.ADMIN_PASS || 'dev-session-secret'
  }

  throw new Error('ADMIN_SESSION_SECRET is not set')
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sign(payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  )

  return toHex(signature)
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

export async function createSessionValue() {
  const createdAt = Math.floor(Date.now() / 1000)
  const payload = `admin.${createdAt}`
  const signature = await sign(payload)
  return `${payload}.${signature}`
}

export async function isValidSession(value) {
  if (!value) return false

  const parts = value.split('.')
  if (parts.length !== 3) return false

  const [subject, createdAtRaw, signature] = parts
  if (subject !== 'admin') return false

  const createdAt = Number(createdAtRaw)
  if (!Number.isFinite(createdAt)) return false

  const now = Math.floor(Date.now() / 1000)
  if (createdAt > now || now - createdAt > SESSION_MAX_AGE_SECONDS) {
    return false
  }

  const expected = await sign(`${subject}.${createdAtRaw}`)
  return timingSafeEqual(signature, expected)
}

export { SESSION_MAX_AGE_SECONDS }
