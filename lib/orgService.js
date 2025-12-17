// lib/orgService.js
import { query } from './db'
import { getCurrentOrgId } from './orgContext'

export async function getCurrentOrg() {
  const orgId = getCurrentOrgId()

  const res = await query(
    'SELECT id, name FROM orgs WHERE id = $1',
    [orgId]
  )

  if (!res.rows.length) {
    throw new Error('Org not found for current context')
  }

  return res.rows[0]
}
