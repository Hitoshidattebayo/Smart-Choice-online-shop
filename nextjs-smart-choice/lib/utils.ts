import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const runFireworks = () => {
    // Placeholder for fireworks animation
    console.log('Fireworks!');
};
