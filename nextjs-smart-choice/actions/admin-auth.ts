'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234'; // Fallback for dev

export async function loginAdmin(formData: FormData) {
    const pin = formData.get('pin') as string;

    if (pin === ADMIN_PIN) {
        // Set cookie valid for 24 hours
        cookies().set('admin_token', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });
        return { success: true };
    } else {
        return { success: false, error: 'Incorrect PIN' };
    }
}

export async function logoutAdmin() {
    cookies().delete('admin_token');
    redirect('/');
}
