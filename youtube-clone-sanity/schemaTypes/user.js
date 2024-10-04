import {defineField, defineType} from 'sanity'

export const user = defineType({
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      defineField({
    
        name: 'name',
        title: 'Name',
        type: 'string',
      }),
      defineField({
        name: 'email',
        title: 'Email',
        type: 'string',
      }),
      defineField({
        name: 'profileImageUrl',
        title: 'Profile Image URL',
        type: 'url',
      }),
      defineField({
        name: 'subscriptions',
        title: 'Subscriptions',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'channel'}]}],
      }),
    ],
  })