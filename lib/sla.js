// lib/sla.js

export function computeSlaStatus(slaDueAt) {
  if (!slaDueAt) return 'UNKNOWN'

  const now = new Date()
  const due = new Date(slaDueAt)
  const diffMs = due - now
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 0) return 'OVERDUE'
  if (diffHours < 24) return 'DUE_SOON'
  return 'WITHIN_SLA'
}
