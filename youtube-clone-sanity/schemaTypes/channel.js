import {defineField, defineType} from 'sanity'

export const channel = defineType({
  name: 'channel',
  title: 'Channel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'profileImageUrl',
      title: 'Profile Image URL',
      type: 'url',
    }),
    defineField({
      name: 'subscribers',
      title: 'Subscribers',
      type: 'number',
    }),
  ],
})