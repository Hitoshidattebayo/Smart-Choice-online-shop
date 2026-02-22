/**
 * Debug script: Simulates what createCartOrder does for stock update.
 * Run with: node scripts/debug-stock-update.js
 */
const { createClient } = require('@sanity/client');
require('dotenv').config();

const token = process.env.SANITY_API_TOKEN;
console.log('Token loaded:', token ? `${token.substring(0, 10)}...` : 'MISSING!');

const writeClient = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
});

// Simulate what order.ts does - pick any real product slug to test
const TEST_PRODUCT_SLUG = 'retro-wave-speaker'; // Change this to a real product slug

async function run() {
    // Step 1: Fetch product (same GROQ as order.ts)
    const products = await writeClient.fetch(
        `*[_type == "product" && slug.current == $slug]{_id, name, price, stockQuantity, stockStatus}`,
        { slug: TEST_PRODUCT_SLUG }
    );

    if (!products.length) {
        console.error('Product not found for slug:', TEST_PRODUCT_SLUG);
        return;
    }

    const product = products[0];
    console.log('\nProduct found:', product.name);
    console.log('stockQuantity:', product.stockQuantity);
    console.log('stockStatus:', product.stockStatus);

    // Step 2: Simulate the dec() the same way order.ts does
    const quantityToDeduct = 1;
    const currentStock = product.stockQuantity || 0;
    const newStock = Math.max(0, currentStock - quantityToDeduct);
    console.log('\nNew stock would be:', newStock);

    try {
        let patch = writeClient
            .patch(product._id)
            .setIfMissing({ stockQuantity: 0 })
            .dec({ stockQuantity: quantityToDeduct });

        if (newStock === 0) {
            patch = patch.set({ stockStatus: 'outOfStock' });
            console.log('Will also set stockStatus = outOfStock');
        }

        const result = await patch.commit();
        console.log('\n✅ SUCCESS! Stock updated!');
        console.log('New stockQuantity in Sanity:', result.stockQuantity);
    } catch (err) {
        console.error('\n❌ PATCH FAILED:', err.message);
        console.log('Status code:', err.statusCode);
        console.log('Full error:', JSON.stringify(err.response?.body, null, 2));
    }
}

run();
