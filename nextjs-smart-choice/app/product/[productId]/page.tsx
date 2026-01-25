import { client, urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";
import ProductDetails from "../../../components/ProductDetails";
import { Product } from "../../../lib/products";
import { type SanityDocument } from "next-sanity";
import FAQSection from "../../../components/FAQSection";
import RelatedProducts from "../../../components/RelatedProducts";

const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]{
    ...,
    "productVideos": productVideos[].asset->url
}`;

const FAQ_QUERY = `*[_type == "faq"]`;

const RELATED_PRODUCTS_QUERY = `*[_type == "product" && slug.current != $slug][0...4]`;

const options = { next: { revalidate: 30 } };

export default async function ProductPage({
    params,
}: {
    params: { productId: string };
}) {
    // Determine slug from params (productId serves as slug in this route)
    const slug = params.productId;

    // Fetch Product, FAQs, and Related Products in parallel
    const [productData, globalFaqs, relatedProductsData] = await Promise.all([
        client.fetch<SanityDocument>(PRODUCT_QUERY, { slug }, options),
        client.fetch<SanityDocument[]>(FAQ_QUERY, {}, options),
        client.fetch<SanityDocument[]>(RELATED_PRODUCTS_QUERY, { slug }, options)
    ]);


    if (!productData) {
        notFound();
    }

    // Map Sanity data to our Product interface
    const product: Product = {
        id: productData._id,
        name: productData.name,
        price: productData.price,
        originalPrice: productData.originalPrice,
        description: productData.description,
        // Use the first image as main, or default to empty string
        image: productData.images && productData.images.length > 0
            ? urlFor(productData.images[0]).url()
            : '',
        // Map all images
        gallery: productData.images?.map((img: any) => urlFor(img).url()) || [],
        variants: productData.variants || [],
        rating: 0,
        reviews: 0,
        stockStatus: productData.stockStatus,
        videoSectionTitle: productData.videoSectionTitle,
        productVideos: productData.productVideos || [],
        faqs: productData.faqs || []
    };

    // Map Related Products
    const relatedProducts = relatedProductsData.map((p: any) => ({
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

    return (
        <div className="bg-white">
            <ProductDetails product={product} />
            <FAQSection faqs={globalFaqs} />
            <RelatedProducts products={relatedProducts} />
        </div>
    );
}
