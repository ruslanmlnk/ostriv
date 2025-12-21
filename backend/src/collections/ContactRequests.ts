import { CollectionConfig } from 'payload'
import { sql } from '@payloadcms/db-postgres'

let ensuredLockColumn = false

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  admin: {
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'source', 'createdAt'],
    description: 'Запити з контактної форми та блоку консультації',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: "Ім'я",
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Тема / заголовок',
      required: false,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Повідомлення',
      required: false,
    },
    {
      name: 'source',
      type: 'select',
      label: 'Джерело',
      defaultValue: 'contact-page',
      options: [
        { label: 'Сторінка контакти', value: 'contact-page' },
        { label: 'Потрібна консультація (головна)', value: 'promo-consultation' },
        { label: 'Інше', value: 'other' },
      ],
      required: false,
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ req }) => {
        if (ensuredLockColumn) return
        try {
          await req.payload.db.drizzle?.execute(
            sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "contact_requests_id" integer;`,
          )
          ensuredLockColumn = true
        } catch (error) {
          req.payload.logger.error({
            msg: 'Failed to ensure contact_requests lock column',
            err: error,
          })
        }
      },
    ],
  },
}
