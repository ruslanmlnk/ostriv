import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
