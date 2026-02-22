const { createClient } = require('@sanity/client');
require('dotenv').config();

const client = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_API_TOKEN,
});

async function main() {
    console.log('Fetching products...');
    const products = await client.fetch(`*[_type == "product" && slug.current == "retro-wave-speaker"]`);

    if (products.length === 0) {
        console.log('No Retro Wave Speaker found.');
        return;
    }

    const product = products[0];
    console.log('Found product:', product.name);

    if (!product.variants) {
        console.log('No variants found.');
        return;
    }

    const updatedVariants = product.variants.map((v) => {
        if (v.id === 'color' || v.id === 'undefined') {
            return {
                ...v,
                values: [
                    { _key: 'color1', name: 'Цайвар ногоон', value: '#90EE90' },
                    { _key: 'color2', name: 'Бор', value: '#8B4513' },
                    { _key: 'color3', name: 'Цагаан', value: '#FFFFFF' },
                ]
            };
        }
        return v;
    });

    try {
        console.log('Updating variants...');
        await client.patch(product._id).set({ variants: updatedVariants }).commit();
        console.log('Update successful!');
    } catch (e) {
        console.error('Update failed:', e);
    }
}

main();
