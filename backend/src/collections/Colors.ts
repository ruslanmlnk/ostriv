import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Colors: CollectionConfig = {
  slug: 'colors',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'hex'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      index: true,
    },
    {
      name: 'hex',
      type: 'text',
      label: 'Hex color (наприклад, #FF0000)',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.slug) return data;
        const src = (data?.title as string) || '';
        if (!src.trim()) return data;
        const slug = slugify(src);
        return slug ? { ...data, slug } : data;
      },
    ],
  },
}
