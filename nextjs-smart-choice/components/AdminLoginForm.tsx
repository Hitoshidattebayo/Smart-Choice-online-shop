'use client';

import { useState } from 'react';
import { loginAdmin } from '@/actions/admin-auth';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginForm() {
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const res = await loginAdmin(formData);
        if (res.success) {
            router.refresh(); // Refresh to trigger server component re-render (which will check cookie)
        } else {
            setError(res.error || 'Failed to login');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the secret PIN to continue
                    </p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="pin" className="sr-only">Secret PIN</label>
                        <input
                            id="pin"
                            name="pin"
                            type="password"
                            required
                            className="relative block w-full rounded-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            placeholder="Enter PIN"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
