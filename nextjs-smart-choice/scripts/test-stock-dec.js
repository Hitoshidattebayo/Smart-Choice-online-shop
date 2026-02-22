const { createClient } = require('@sanity/client');
require('dotenv').config();

const client = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
});

async function test() {
    // First fetch the product
    const product = await client.fetch('*[_type == "product" && slug.current == "retro-wave-speaker"][0]{_id, name, stockQuantity}');
    console.log('Before:', product);

    if (!product) {
        console.log('Product not found!');
        return;
    }

    // Try to dec stockQuantity by 1
    try {
        const result = await client
            .patch(product._id)
            .setIfMissing({ stockQuantity: 0 })
            .dec({ stockQuantity: 1 })
            .commit();
        console.log('After patch - stockQuantity:', result.stockQuantity);
        console.log('SUCCESS: stockQuantity decremented!');
    } catch (err) {
        console.error('PATCH FAILED:', err.message);
        console.log('Status:', err.statusCode);
    }
}

test();
