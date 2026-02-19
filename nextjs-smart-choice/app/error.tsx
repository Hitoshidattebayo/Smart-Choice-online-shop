'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ямар нэг зүйл буруу боллоо!</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                Уучлаарай, алдаа гарлаа. Та дахин оролдож үзнэ үү.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                Дахин оролдох
            </button>
        </div>
    );
}
