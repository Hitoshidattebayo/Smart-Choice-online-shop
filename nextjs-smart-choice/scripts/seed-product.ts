
import { createClient } from '@sanity/client'
import path from 'path'
import fs from 'fs'

// Initialize the client with a token (required for write operations)
const client = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_API_TOKEN, // Allow token from env
    useCdn: false,
})

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'retro-wave-speaker')

const productData = {
    _type: 'product',
    name: 'Retro Wave Speaker',
    slug: { _type: 'slug', current: 'retro-wave-speaker' },
    price: 110000,
    originalPrice: 135000,
    description: 'Experience the perfect blend of nostalgia and modern technology. The Retro Wave Speaker features rich stereo sound, Bluetooth connectivity, SD card support, and a calming ambient light mode. Its vinyl record-inspired design adds a touch of classic elegance to any room.',
    variants: [
        {
            label: 'Production Color Selection',
            type: 'color',
            values: ['#90EE90', '#8B4513', '#FFFFFF']
        }
    ]
}

async function uploadImage(fileName: string) {
    const filePath = path.join(IMAGES_DIR, fileName)
    if (!fs.existsSync(filePath)) {
        console.error(`Image not found: ${filePath}`)
        return null
    }
    const buffer = fs.readFileSync(filePath)
    try {
        const asset = await client.assets.upload('image', buffer, {
            filename: fileName
        })
        console.log(`Uploaded ${fileName}: ${asset._id}`)
        return asset._id
    } catch (err: any) {
        console.error(`Failed to upload ${fileName}:`, err.message)
        return null
    }
}

async function seed() {
    if (!process.env.SANITY_API_TOKEN) {
        console.error('Error: SANITY_API_TOKEN environment variable is not set.')
        console.error('Please run with: set SANITY_API_TOKEN=your_token && npx tsx scripts/seed-product.ts')
        process.exit(1)
    }

    console.log('Starting seed...')

    // Images to upload (exclude main.png as requested previously, or include? usage seems to point to detail-1 as main)
    // Based on lib/products.ts: product.image was detail-1.jpg, gallery was detail-1, 2, 3, 4
    const imageFiles = ['detail-1.jpg', 'detail-2.jpg', 'detail-3.jpg', 'detail-4.jpg']

    const imageAssets = []
    for (const file of imageFiles) {
        const assetId = await uploadImage(file)
        if (assetId) {
            imageAssets.push({
                _key: assetId,
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: assetId
                }
            })
        }
    }

    const doc = {
        ...productData,
        images: imageAssets
    }

    try {
        const res = await client.createOrReplace({ _id: 'waves-speaker-seed', ...doc })
        console.log('Product created:', res._id)
    } catch (err: any) {
        console.error('Failed to create product:', err.message)
    }
}

seed()
