'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Custom Error Page for the Home Page
export default function HomeErrorPage({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    // Render Custom Error Page for Home Page
    return (
        <div className="bg-gray-800 px-4 py-10 text-gray-300 shadow-lg sm:px-6 lg:px-8">
            <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-4 text-3xl font-bold text-gray-100">
                    Error Loading Home Page
                </h3>
                <p className="mb-8 text-xl text-gray-400">
                    We are having trouble retrieving the Home page. This could likely be
                    due to network issues.
                    <br />
                </p>
                <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Button
                        asChild
                        variant="outline"
                        className="inline-flex items-center rounded-md border border-gray-600 bg-gray-900 px-6 py-3 text-base font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}