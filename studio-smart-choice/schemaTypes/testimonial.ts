import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        defineField({
            name: 'author',
            title: 'Author Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role / Title',
            type: 'string',
            description: 'e.g. "Verified Buyer", "Software Engineer"',
        }),
        defineField({
            name: 'text',
            title: 'Testimonial Text',
            type: 'text',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'avatar',
            title: 'User Avatar / Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
})
