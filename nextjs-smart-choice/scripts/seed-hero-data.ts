
import { createClient } from "next-sanity";
import { createReadStream } from "fs";
import { join } from "path";

// Load environment variables if running locally with .env
// dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'eiivfy8o';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
    console.error("Missing SANITY_API_TOKEN. Please provide it as an environment variable.");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token, // Token with write permissions
    useCdn: false,
    apiVersion: "2024-01-01",
});

async function uploadImage(fileName: string) {
    const filePath = join(process.cwd(), "public", fileName);
    console.log(`Uploading image: ${fileName}...`);
    try {
        const imageAsset = await client.assets.upload("image", createReadStream(filePath), {
            filename: fileName,
        });
        return imageAsset._id;
    } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error);
        return null;
    }
}

async function seed() {
    console.log("Starting Hero Data Migration...");

    // 1. Upload Images
    const speakerImageId = await uploadImage("images/retro-wave-speaker/main.png");
    const chairImageId = await uploadImage("massage-chair.jpg");

    if (!speakerImageId || !chairImageId) {
        console.error("Failed to upload essential images. Aborting.");
        return;
    }

    // 2. Create Massager Chair Product
    console.log("Creating Massager Chair Product...");
    const chairProduct = {
        _id: 'massage-chair-seed',
        _type: 'product',
        name: 'Massager Chair',
        slug: { _type: 'slug', current: 'massage-chair' },
        price: 249, // Stored as number, formatted on frontend
        originalPrice: 299,
        description: 'Experience ultimate comfort with our portable massage chair. Perfect for home or office use.',
        images: [{ _type: 'image', asset: { _type: 'reference', _ref: chairImageId } }],
        variants: [
            {
                _key: 'color-variant',
                label: 'Color',
                type: 'color',
                values: ['#000000', '#808080']
            }
        ]
    };

    await client.createOrReplace(chairProduct);

    // 3. Create Hero Banners
    console.log("Creating Hero Banners...");

    // Speaker Hero
    const speakerHero = {
        _id: 'hero-speaker',
        _type: 'hero',
        title: 'Speaker Promo',
        headline: 'PURE SOUND CLARITY.',
        subtext: 'High quality stereo speaker',
        image: { _type: 'image', asset: { _type: 'reference', _ref: speakerImageId } },
        productLink: { _type: 'reference', _ref: 'waves-speaker-seed' }
    };

    // Chair Hero
    const chairHero = {
        _id: 'hero-chair',
        _type: 'hero',
        title: 'Chair Promo',
        headline: 'RELAX ANYWHERE.',
        subtext: 'Зөөврийн массажны сандал',
        image: { _type: 'image', asset: { _type: 'reference', _ref: chairImageId } },
        productLink: { _type: 'reference', _ref: 'massage-chair-seed' }
    };

    const transaction = client.transaction();
    transaction.createOrReplace(speakerHero);
    transaction.createOrReplace(chairHero);

    await transaction.commit();
    console.log("Migration Complete! Created products and hero banners.");
}

seed();
