import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Hero Banner',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Internal Title',
            type: 'string',
            description: 'For internal use in the studio',
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
        }),
        defineField({
            name: 'subtext',
            title: 'Subtext',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Banner Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'productLink',
            title: 'Link to Product',
            type: 'reference',
            to: [{ type: 'product' }],
            description: 'Select the product this banner should link to',
        }),
    ],
})
