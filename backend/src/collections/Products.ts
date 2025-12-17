import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'isHit', 'isNew'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'model',
      type: 'text',
      label: 'Модель',
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      index: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'oldPrice',
      type: 'number',
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
    },
    {
      name: 'discount',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isHit',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isNew',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'colors',
      type: 'relationship',
      relationTo: 'colors',
      hasMany: true,
      label: 'Кольори (chips)',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.slug) return data;
        const src = (data?.name as string) || '';
        if (!src.trim()) return data;
        const slug = slugify(src);
        return slug ? { ...data, slug } : data;
      },
    ],
  },
}
