import { client, urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";
import ProductDetails from "../../../components/ProductDetails";
import { Product } from "../../../lib/products";
import { type SanityDocument } from "next-sanity";

const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

export default async function ProductPage({
    params,
}: {
    params: { productId: string };
}) {
    // Determine slug from params (productId serves as slug in this route)
    const slug = params.productId;

    const productData = await client.fetch<SanityDocument>(PRODUCT_QUERY, { slug }, options);

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
        reviews: 0
    };

    return (
        <div className="bg-white">
            <ProductDetails product={product} />
        </div>
    );
}
