
import { client, urlFor } from "@/sanity/client";
import HomeContent from "../components/HomeContent";
import { type SanityDocument } from "next-sanity";

// Define GROQ queries
const PRODUCTS_QUERY = `*[_type == "product"]`;
const HERO_QUERY = `*[_type == "hero"]{
  ...,
  productLink->{
    slug,
    price,
    originalPrice
  }
}`;

// Fetch options with revalidation (pattern from user snippet)
const options = { next: { revalidate: 30 } };

export default async function Home() {
    // Parallel Fetching
    const [products, banners] = await Promise.all([
        client.fetch<SanityDocument[]>(PRODUCTS_QUERY, {}, options),
        client.fetch<SanityDocument[]>(HERO_QUERY, {}, options)
    ]);

    // Map Products for Best Sellers
    const bestSellers = products.map((p: any) => ({
        id: p.slug?.current || p._id,
        name: p.name,
        price: p.price ? `${p.price.toLocaleString()}₮` : 'Price N/A',
        image: p.images && p.images[0] ? urlFor(p.images[0]).url() : '/placeholder.jpg',
        badge: p.originalPrice ? 'SALE' : undefined
    }));

    // Map Hero Banners
    const heroProducts = banners.map((b: any) => ({
        id: b.productLink?.slug?.current || 'hero-' + b._id,
        title: b.title || "Offer",
        headline: b.headline,
        description: b.subtext, // Assuming description maps to subtext in hero schema
        subtext: b.subtext,
        price: b.productLink?.price ? `${b.productLink.price.toLocaleString()}₮` : '',
        originalPrice: b.productLink?.originalPrice ? `${b.productLink.originalPrice.toLocaleString()}₮` : null,
        image: b.image ? urlFor(b.image).url() : '/placeholder.jpg'
    }));

    return (
        <main>
            <HomeContent bestSellers={bestSellers} heroProducts={heroProducts} />
        </main>
    );
}
