import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'originalPrice',
            title: 'Original Price',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'variants',
            title: 'Variants',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'id', type: 'string', title: 'ID (unique identifier, e.g. "color", "size")' },
                        { name: 'label', type: 'string', title: 'Label' },
                        {
                            name: 'type',
                            type: 'string',
                            title: 'Type',
                            options: {
                                list: [
                                    { title: 'Color', value: 'color' },
                                    { title: 'Text', value: 'text' },
                                ]
                            }
                        },
                        {
                            name: 'values',
                            type: 'array',
                            title: 'Values',
                            of: [{ type: 'string' }]
                        }
                    ]
                }
            ]
        }),
    ],
})
