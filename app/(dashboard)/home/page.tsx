// app/(dashboard)/page.tsx
import React from 'react';
import { DashboardHeroSection } from './components/DashboardHeroSection'; // Adjusted import path based on common structure
import { TrendingCollectionTable } from './components/TrendingCollectionTable'; // Adjusted import path
// Impor fungsi untuk mengambil data koleksi
import { getAllCollections, Collection } from '@/lib/data/collections'; // <-- Import yang baru

// Data untuk Tabel Trending Collection (tetap bisa terpisah jika ini data berbeda dari carousel)
// Jika Trending Collections juga dari NftCollection, Anda bisa memodifikasi TrendingCollectionTableProps
const trendingCollections = [
    {
        id: 'upri-world-id',
        name: 'Upri World',
        image: '/assets/avatars/avatar-eth.png',
        floor: '0 TEA',
        floorChange: 0,
        volume24h: '0 TEA',
        volume24hChange: 0,
        totalVolume: '0 TEA',
        totalVolumeChange: 0,
        owners: '2500',
        supply: '100000',
    },
    {
        id: 'herbivores-table-id',
        name: 'Herbivores',
        image: '/assets/avatars/avatar-herb.png',
        floor: '0 TEA',
        floorChange: 0,
        volume24h: '0 TEA',
        volume24hChange: 0,
        totalVolume: '0 TEA',
        totalVolumeChange: 0,
        owners: '0',
        supply: '2222',
    },
];

export const metadata = {
    title: 'Dashboard - Home',
    description: 'Halaman Beranda Dashboard NFT.',
};

export default function HomePage() {
    // Ambil data dari sumber tunggal
    const heroCarouselItems: Collection[] = getAllCollections();

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHeroSection items={heroCarouselItems} />
            <TrendingCollectionTable collections={trendingCollections} />
        </div>
    );
}