// app/error.tsx
'use client'; // Error Boundaries harus Client Component

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCw } from 'lucide-react'; // Menggunakan AlertTriangle untuk error yang lebih umum
import { Button } from '@/components/ui/button';

// Halaman Error Global untuk aplikasi Next.js
export default function GlobalErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void; // Fungsi untuk mencoba mereset Error Boundary
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry, LogRocket, etc.
        // For development, we'll log to console.
        console.error('Unhandled Global Error:', error);
        // Anda juga bisa mengirim error.digest ke layanan pelaporan error di sini
        // jika Anda menggunakan Next.js App Router dengan error.digest.
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full flex flex-col items-center">
                <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" /> {/* Ikon error besar */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
                    Oops! Something Went Wrong.
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                    We apologize, but an unexpected error occurred.
                    Please try again or return to the homepage.
                </p>

                {/* Display a technical error message in development for debugging */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-left mb-6 w-full max-h-48 overflow-auto">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Error Details:</h4>
                        <p className="text-red-600 dark:text-red-400 font-mono break-words">{error.message}</p>
                        {error.digest && <p className="text-gray-600 dark:text-gray-400 mt-2">Digest: {error.digest}</p>}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button
                        onClick={() => reset()} // Fungsi `reset` untuk mencoba kembali
                        className="py-3 px-6 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                        <RotateCw className="w-5 h-5" /> Try Again
                    </Button>
                    <Link href="/" passHref>
                        <Button
                            variant="outline"
                            className="py-3 px-6 text-lg font-semibold rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                        >
                            <Home className="w-5 h-5" /> Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}