export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    features: string[]; // Added for PDP detailed view
}

export const PRODUCTS: Product[] = [
    {
        id: 'prod_001',
        name: 'Camel Wool Blanket',
        price: 150000,
        description: '100% authentic Mongolian camel wool. Experience warmth like never before.',
        image: 'https://placehold.co/800x600/F4EBD0/004940/png?text=Camel+Wool+Blanket',
        features: ['100% Organic Camel Wool', 'Hypoallergenic', 'Sustainable & Eco-friendly', 'Made in Mongolia']
    },
    {
        id: 'prod_002',
        name: 'Cashmere Scarf',
        price: 85000,
        description: 'Premium quality cashmere. Soft touch, elegant design, everyday luxury.',
        image: 'https://placehold.co/800x600/E5E5E5/004940/png?text=Cashmere+Scarf',
        features: ['Premium Grade-A Cashmere', 'Ultra-soft texture', 'Classic fringes', 'Dry clean only']
    },
    {
        id: 'prod_white_noise',
        name: 'Retro White Noise Sleep Aid',
        price: 89000,
        description: 'Combines retro vinyl aesthetics with modern sleep technology. Features soothing nature sounds, everyday clock functionality, and ambient RGB lighting.',
        image: 'https://img.alicdn.com/imgextra/i2/O1CN01Q2zGIi1seKennaLIB_!!6000000005791-0-tps-1890-1062.jpg',
        features: [
            'Immersive Nature Sounds (Waves, Rain, Forest)',
            'Retro Vinyl Turntable Design',
            'Ambient RGB Mood Lighting',
            'Built-in Digital Clock'
        ]
    }
];

export function getProduct(id: string) {
    return PRODUCTS.find((p) => p.id === id);
}
