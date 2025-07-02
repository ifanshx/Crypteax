// app/page.tsx
import React from 'react';
import Link from 'next/link'; // Import Link dari Next.js untuk navigasi
import { Button } from '@/components/ui/button'; // Asumsi Anda punya komponen Button dari shadcn/ui

export const metadata = {
    title: 'Welcome - Cryptea',
    description: 'Welcome to Cryptea, your gateway to the world of tea and NFTs.',
};

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-8">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2 text-center leading-tight">
                All you need is a Tea.
            </h1>
            <p
                className="text-xl text-gray-600 mb-10 text-center max-w-2xl"
            >
                Read the benefits of tea on{" "}
                <Link
                    href="https://en.wikipedia.org/wiki/Tea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 underline hover:text-green-200"
                    aria-label="Read more about tea on Wikipedia"
                >
                    Wikipedia
                </Link>
            </p>
            <div className="flex space-x-4">
                {/* Tombol yang mengarahkan ke Dashboard */}
                <Link href="/home" passHref>
                    <Button className="px-8 py-4 text-lg bg-gray-500 hover:bg-gray-950 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                        Enter
                    </Button>
                </Link>
            </div>
        </div>
    );
}