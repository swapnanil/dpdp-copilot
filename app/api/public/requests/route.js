export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { createDpdpRequest } from '../../../../lib/requestService'
import { parseRequestBody } from '../../../../lib/validation'

export async function POST(req) {
  let body

  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const parsed = parseRequestBody(body)
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const result = await createDpdpRequest({
    ...parsed.value,
    source: 'public_form'
  })

  return Response.json(result, { status: 201 })
}
