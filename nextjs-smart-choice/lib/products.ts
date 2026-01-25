export interface ProductVariant {
    id: string;
    label: string;
    type: 'square' | 'rect' | 'color'; // square=small box, rect=wide box, color=circle
    values: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    description: string;
    image: string; // Kept for type compatibility but won't be used as an image
    gallery?: string[];
    badge?: string;
    variants?: ProductVariant[];
    specifications?: { label: string; value: string }[];
    stockStatus?: string;
    productVideos?: string[];
    videoSectionTitle?: string;
    faqs?: { question: string; answer: string }[];
}

export const products: Product[] = [
    {
        id: 'waves-speaker',
        name: 'Retro Wave Speaker',
        price: 110000,
        originalPrice: 135000,
        rating: 4.8,
        reviews: 24,
        description: 'Experience the perfect blend of nostalgia and modern technology. The Retro Wave Speaker features rich stereo sound, Bluetooth connectivity, SD card support, and a calming ambient light mode. Its vinyl record-inspired design adds a touch of classic elegance to any room.',
        image: '/images/retro-wave-speaker/detail-1.jpg',
        gallery: [
            '/images/retro-wave-speaker/detail-1.jpg',
            '/images/retro-wave-speaker/detail-2.jpg',
            '/images/retro-wave-speaker/detail-3.jpg',
            '/images/retro-wave-speaker/detail-4.jpg'
        ],
        badge: 'Best Seller',
        variants: [
            {
                id: 'color',
                label: 'Product Color Selection',
                type: 'color',
                values: ['#90EE90', '#8B4513', '#FFFFFF'] // Light Green, Saddle Brown, White
            }
        ],
        specifications: []
    }
];

export function getProduct(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getAllProducts(): Product[] {
    return products;
}
