// lib/orgService.js
import { query } from './db'
import { getCurrentOrgId } from './orgContext'

export async function getCurrentOrg() {
  const orgId = getCurrentOrgId()

  if (!orgId) {
    throw new Error('DEFAULT_ORG_ID is not set')
  }

  const res = await query(
    'SELECT id, name, sla_days FROM orgs WHERE id = $1',
    [orgId]
  )

  if (!res.rows.length) {
    throw new Error('Org not found for current context')
  }

  return res.rows[0]
}

export async function getCurrentOrgSafe() {
  try {
    return await getCurrentOrg()
  } catch {
    return {
      id: null,
      name: 'Organization not configured',
      sla_days: 7
    }
  }
}
