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
            name: 'stockStatus',
            title: 'Stock Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Бэлэн', value: 'instock' },
                    { title: 'Захиалгаар', value: 'preorder' },
                    { title: 'Дууссан', value: 'outOfStock' },
                ],
                layout: 'radio'
            },
            initialValue: 'instock'
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
        defineField({
            name: 'videoSectionTitle',
            title: 'Video Section Title',
            type: 'string',
            initialValue: 'Trusted by 65.000+ people just like you!',
            description: 'Title displayed above the video carousel.'
        }),
        defineField({
            name: 'productVideos',
            title: 'Product Videos (9:16)',
            type: 'array',
            of: [{ type: 'file', options: { accept: 'video/*' } }],
            description: 'Upload 9:16 vertical videos for the swipeable carousel.'
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string', title: 'Question' },
                        { name: 'answer', type: 'text', title: 'Answer' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'classificationCode',
            title: 'Classification Code (EBarimt)',
            type: 'string',
            description: 'The product classification code for EBarimt (e.g., 0111100). Essential for tax receipts.'
        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
            description: 'Average product rating (e.g. 4.8).',
            initialValue: 5,
        }),
        defineField({
            name: 'reviews',
            title: 'Number of Reviews',
            type: 'number',
            description: 'Total number of reviews.',
            initialValue: 0,
        }),
        defineField({
            name: 'deliveryAndReturns',
            title: 'Delivery and Returns Info',
            type: 'text',
            description: 'Information displayed in the Delivery and Returns accordion. You can use multiple lines.',
            initialValue: '100,000₮-с дээш худалдан авалтад хүргэлт үнэгүй.\n14 хоногийн дотор буцаах боломжтой.'
        }),
    ],
})
