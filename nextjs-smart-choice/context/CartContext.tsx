'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    interface AddToCartItem extends Omit<CartItem, 'quantity'> {
        quantity?: number;
    }

    const addToCart = (item: AddToCartItem) => {
        const quantityToAdd = item.quantity || 1;

        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

            if (existingItem) {
                // Item already in cart, increment quantity
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
                        : cartItem
                );
            } else {
                // New item, add to cart with quantity
                return [...prevCart, { ...item, quantity: quantityToAdd }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen(prev => !prev);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
