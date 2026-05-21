export const SUPPORTED_LANGUAGES = new Set([
  'English',
  'Hindi',
  'Bengali',
  'Tamil',
  'Marathi'
])

export function parseRequestBody(body) {
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const language =
    typeof body?.language === 'string' && SUPPORTED_LANGUAGES.has(body.language)
      ? body.language
      : 'English'

  if (!message) {
    return { ok: false, error: 'message is required' }
  }

  if (message.length > 10000) {
    return { ok: false, error: 'message is too long' }
  }

  return {
    ok: true,
    value: {
      message,
      language
    }
  }
}
