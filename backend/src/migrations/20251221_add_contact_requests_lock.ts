import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Add column used by Payload's document locking for the new contact-requests collection
  await payload.db.drizzle?.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "contact_requests_id" integer;`,
  )
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle?.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contact_requests_id";`,
  )
}
