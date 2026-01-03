
import { createClient } from "next-sanity";
import * as dotenv from "dotenv";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'eiivfy8o';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN; // Need token to read if dataset is private, likely public is fine for read but using token to be safe if provided

const client = createClient({
    projectId,
    dataset,
    // token, 
    useCdn: false,
    apiVersion: "2024-01-01",
});

async function checkSlugs() {
    console.log("Fetching Products...");
    const products = await client.fetch(`*[_type == "product"]{_id, name, slug}`);
    console.log("Products:", JSON.stringify(products, null, 2));

    console.log("\nFetching Heros...");
    const heros = await client.fetch(`*[_type == "hero"]{_id, title, productLink->{name, slug}}`);
    console.log("Heros:", JSON.stringify(heros, null, 2));
}

checkSlugs();
