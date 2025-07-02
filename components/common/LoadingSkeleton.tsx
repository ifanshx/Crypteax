// components/common/LoadingSkeleton.tsx
import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse p-6 lg:p-10">
            {/* Skeleton untuk Topbar (Jika tidak ada di layout utama, ini akan menjadi overlay) */}
            {/* Mengingat topbar sudah fixed dan dimuat lebih awal, ini lebih untuk konten utama */}
            <div className="fixed left-16 top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10 hidden md:block"></div>

            <div className="flex flex-col flex-1 ml-0 md:ml-16 pt-0 md:pt-20"> {/* Sesuaikan dengan padding layout */}
                {/* Skeleton untuk Hero Section / Main Banner */}
                <div className="w-full h-[250px] md:h-[350px] lg:h-[450px] bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-lg mb-8">
                    {/* Placeholder for inner elements of the banner */}
                    <div className="flex flex-col justify-end h-full p-6">
                        <div className="w-40 h-8 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
                        <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    </div>
                </div>

                {/* Skeleton untuk Thumbnail Navigasi (jika ada) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-full h-[120px] bg-gray-200 dark:bg-gray-800 rounded-xl shadow-md"></div>
                    ))}
                </div>

                {/* Skeleton untuk Bagian Info Utama / Grid (misalnya About Section & Details) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Kolom Kiri (Deskripsi) */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 h-80 flex flex-col gap-4">
                        <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="flex gap-4 mt-auto">
                            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Detail Minting) */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 h-80 flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mt-auto"></div>
                    </div>
                </div>

                {/* Skeleton untuk Grid NFT (jika ada) atau Tabel (jika ada) */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 h-[400px]">
                    <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, i) => ( // Tampilkan 5 kartu NFT skeleton
                            <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 shadow-sm flex flex-col">
                                <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-t-xl"></div>
                                <div className="p-3 flex flex-col gap-2">
                                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                                    <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded-lg mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}