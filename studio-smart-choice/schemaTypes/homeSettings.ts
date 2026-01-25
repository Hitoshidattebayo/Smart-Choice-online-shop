import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homeSettings',
    title: 'Home Page Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'reviewSectionTitle',
            title: 'Review Section Title',
            type: 'string',
            initialValue: 'FIND OUT WHAT PEOPLE ARE SAYING ABOUT QUENX',
        }),
    ],
})
