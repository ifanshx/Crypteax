// app/page.tsx
import React from 'react';
import Link from 'next/link'; // Import Link dari Next.js untuk navigasi
import { Button } from '@/components/ui/button'; // Asumsi Anda punya komponen Button dari shadcn/ui
import Image from 'next/image';
import { FooterHome } from '@/components/common/FooterHome';

export const metadata = {
    title: 'Welcome - Cryptea',
    description: 'Welcome to Cryptea, your gateway to the world of tea and NFTs.',
};

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center  bg-cover bg-no-repeat  p-6 md:p-8"> {/* Responsive padding */}
            <Image
                src="/assets/general/backgroundhome.png" // Menggunakan path gambar Anda
                alt="Background image with tea leaves"
                layout="fill" // Menggunakan layout="fill" untuk gambar background
                objectFit="cover"
                quality={100} // Kualitas lebih tinggi untuk background
                priority // Memuat lebih awal karena ini halaman pertama yang mungkin dilihat
                className="-z-10" // Menempatkan gambar di belakang konten lain
            />

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 text-center leading-tight"> {/* Responsive font size */}
                🌱 Cryptea 🌱
            </h1> <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 text-center leading-tight"> {/* Responsive font size */}
                All you need is a Tea.
            </h1>
            <p
                className="text-lg sm:text-xl text-white mb-35 md:mb-40 text-center max-w-xl" // Responsive font size and max-width
            >
                Read the benefits of tea on{" "}
                <Link
                    href="https://en.wikipedia.org/wiki/Tea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline hover:text-green-500"
                    aria-label="Read more about tea on Wikipedia"
                >
                    Wikipedia
                </Link>
            </p>
            <div className="flex space-x-4">
                {/* Tombol yang mengarahkan ke Dashboard */}
                <Link href="/home" passHref>
                    <Button className="px-6 py-3 sm:px-8 sm:py-4 text-lg bg-gray-100 hover:bg-gray-250 text-black rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"> {/* Responsive padding and text size */}
                        Enter
                    </Button>
                </Link>
            </div>
            <FooterHome />
        </div>
    );
}