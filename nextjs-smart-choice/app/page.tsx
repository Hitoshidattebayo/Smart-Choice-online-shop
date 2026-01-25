
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

const FAQ_QUERY = `*[_type == "faq"]`;

const TESTIMONIALS_QUERY = `*[_type == "testimonial"]`;
const HOME_SETTINGS_QUERY = `*[_type == "homeSettings"][0]`;

// Fetch options with revalidation (pattern from user snippet)
const options = { next: { revalidate: 30 } };

export default async function Home() {
    // Parallel Fetching
    const [products, banners, faqs, testimonials, homeSettings] = await Promise.all([
        client.fetch<SanityDocument[]>(PRODUCTS_QUERY, {}, options),
        client.fetch<SanityDocument[]>(HERO_QUERY, {}, options),
        client.fetch<SanityDocument[]>(FAQ_QUERY, {}, options),
        client.fetch<SanityDocument[]>(TESTIMONIALS_QUERY, {}, options),
        client.fetch<SanityDocument>(HOME_SETTINGS_QUERY, {}, options)
    ]);

    // Map Products for Best Sellers
    const bestSellers = products.map((p: any) => ({
        id: p.slug?.current || p._id,
        name: p.name,
        price: p.price ? `${p.price.toLocaleString()}₮` : 'Price N/A',
        originalPrice: p.originalPrice ? `${p.originalPrice.toLocaleString()}₮` : null,
        discountPercentage: p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
        image: p.images && p.images[0] ? urlFor(p.images[0]).url() : '/placeholder.jpg',
        badge: (() => {
            const statusMap: Record<string, string> = {
                'instock': 'Бэлэн',
                'preorder': 'Захиалгаар',
                'outOfStock': 'Дууссан'
            };
            return p.stockStatus ? statusMap[p.stockStatus] : (p.originalPrice ? 'SALE' : undefined);
        })(),
        badgeType: p.stockStatus || (p.originalPrice ? 'sale' : undefined)
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

    const mappedTestimonials = testimonials.map((t: any) => ({
        id: t._id,
        text: t.text,
        author: t.author,
        role: t.role,
        avatar: t.avatar ? urlFor(t.avatar).url() : null
    }));

    return (
        <main>
            <HomeContent
                bestSellers={bestSellers}
                heroProducts={heroProducts}
                faqs={faqs}
                testimonials={mappedTestimonials}
                reviewTitle={homeSettings?.reviewSectionTitle}
            />
        </main>
    );
}
