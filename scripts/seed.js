import { v4 as uuid } from 'uuid'
import { pool } from '../lib/db.js'

async function main() {
  const orgId = process.env.DEFAULT_ORG_ID || uuid()
  const orgName = process.env.DEFAULT_ORG_NAME || 'Demo Organization'

  await pool.query(
    `INSERT INTO orgs (id, name)
     VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE
     SET name = EXCLUDED.name`,
    [orgId, orgName]
  )

  console.log(`Seeded org ${orgName} (${orgId})`)
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
