import Anthropic from '@anthropic-ai/sdk'

const REQUEST_TYPES = new Set(['Grievance', 'Access', 'Rectification', 'Deletion'])

const MODEL = process.env.MODEL || 'claude-sonnet-4-6'
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '1024', 10)
const MAX_RETRIES = 3

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

async function callWithRetry(fn) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const isRetryable = err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError
      if (!isRetryable || attempt === MAX_RETRIES - 1) throw err
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}

export async function classifyRequest(text) {
  const client = getClient()

  const response = await callWithRetry(() =>
    client.messages.create({
      model: MODEL,
      max_tokens: 256,
      system: [
        {
          type: 'text',
          text: 'You are a DPDP compliance assistant. Classify incoming data principal requests under India\'s DPDP Act 2023. Return only valid JSON with no explanation.',
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [
        {
          role: 'user',
          content: `Classify this message into exactly one of: Grievance, Access, Rectification, Deletion.\nRespond as {"type":"<classification>"}.\n\nMessage:\n${text}`
        }
      ]
    })
  )

  let parsed
  try {
    parsed = JSON.parse(response.content[0].text)
  } catch {
    throw new Error('Failed to parse request classification')
  }

  const type = parsed.type || parsed.classification || parsed.request_type
  if (!REQUEST_TYPES.has(type)) {
    throw new Error(`Invalid classification received: ${type}`)
  }
  return type
}

export async function draftReply(text, type, language = 'English') {
  const client = getClient()
  const targetLanguage = typeof language === 'string' ? language : 'English'

  const response = await callWithRetry(() =>
    client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: `You are a DPDP compliance officer drafting replies to data principal requests under India's Digital Personal Data Protection Act 2023. Write professional, empathetic replies that: acknowledge the request type, confirm receipt and logging, state the 7-day response timeline, and explain the next step. Keep the tone formal but accessible.`,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [
        {
          role: 'user',
          content: `Draft a DPDP-compliant reply in ${targetLanguage} for a ${type} request.\n\nCustomer message:\n${text}`
        }
      ]
    })
  )

  return response.content[0].text.trim()
}
