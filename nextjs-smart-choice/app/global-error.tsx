'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                    <h2 className="text-2xl font-bold mb-4">Ноцтой алдаа гарлаа!</h2>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Дахин оролдох
                    </button>
                </div>
            </body>
        </html>
    );
}
