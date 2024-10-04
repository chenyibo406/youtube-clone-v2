import {defineField, defineType} from 'sanity'

export const video = defineType({
    name: 'video',
    title: 'Video',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
      }),
      defineField({
        name: 'videoUrl',
        title: 'Video URL',
        type: 'url',
      }),
      defineField(  {
        name: 'thumbnailUrl',
        title: 'Thumbnail URL',
        type: 'url',
      }),
      defineField(  {
        name: 'views',
        title: 'Views',
        type: 'number',
      }),
      defineField(    {
        name: 'likes',
        title: 'Likes',
        type: 'number',
      }),
      defineField(    {
        name: 'channel',
        title: 'Channel',
        type: 'reference',
        to: [{type: 'channel'}],
      }),
      defineField({
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime',
      }),
    ],
  })