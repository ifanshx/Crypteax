// app/(dashboard)/collections/[collectionId]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { getCollectionById } from '@/lib/data/collections'; // Import fungsi untuk mengambil data koleksi
import { X, Globe, Radio } from 'lucide-react'; // Import ikon sosial media

interface MintPageProps {
    params: {
        collectionId: string;
    };
}

// Fungsi untuk mengambil data koleksi
async function getCollectionData(collectionId: string) {
    return getCollectionById(collectionId);
}

export async function generateMetadata({ params }: MintPageProps) {
    const collection = await getCollectionData(params.collectionId);

    if (!collection) {
        return {
            title: 'Collection Not Found',
            description: 'Koleksi NFT tidak ditemukan.',
        };
    }

    return {
        title: `${collection.name} - Mint Page`,
        description: collection.description,
    };
}

export default async function MintPage({ params }: MintPageProps) {
    const collection = await getCollectionData(params.collectionId);

    if (!collection) {
        notFound();
    }

    // Hitung persentase supply
    const supplyPercentage = collection.maxSupply && collection.maxSupply > 0
        ? (collection.currentSupply || 0) / collection.maxSupply * 100
        : 0;

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Banner Koleksi (Background Blur & Overlay) */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl group">
                {/* Gambar Background dengan efek blur */}
                <Image
                    src={collection.bannerUrl}
                    alt={`${collection.name} Banner`}
                    layout="fill"
                    objectFit="cover"
                    className="z-0 brightness-75 transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay transparan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

                {/* Konten di atas banner */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20 text-white">
                    <div className="flex items-end gap-6 mb-4">
                        {/* Logo Koleksi di Atas Banner */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={collection.imageUrl}
                                alt={`${collection.name} Logo`}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                                {collection.name}
                            </h1>
                            <div className="flex items-center space-x-3 text-lg font-semibold mt-2">
                                {collection.status === 'Live' && <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>}
                                {collection.status === 'Ended' && <span className="w-4 h-4 bg-red-500 rounded-full"></span>}
                                {collection.status === 'Coming Soon' && <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>}
                                <span className="drop-shadow-md">{collection.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Deskripsi & Info Sosial (Akan jadi col-span-2 di md, dan 1 di lg) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-3">About {collection.name}</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">{collection.description}</p>

                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                        {collection.externalUrl && (
                            <Link href={collection.externalUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Globe className="w-5 h-5" /> Website
                                </Button>
                            </Link>
                        )}
                        {collection.twitterUrl && (
                            <Link href={collection.twitterUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <X className="w-5 h-5" /> Twitter
                                </Button>
                            </Link>
                        )}
                        {collection.discordUrl && (
                            <Link href={collection.discordUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Radio className="w-5 h-5" /> Discord
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan: Detail Minting / Status */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col gap-6 items-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{collection.name}</h3>
                    {/* Progress Bar untuk Supply */}
                    {collection.status === 'Live' && collection.maxSupply && collection.maxSupply > 0 && (
                        <div className="w-full text-center mb-4">
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{ width: `${supplyPercentage}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-out"
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-600">
                                    <span>{collection.currentSupply || 0} / {collection.maxSupply} Minted</span>
                                    <span>{supplyPercentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    )}


                    {collection.status === 'Live' && (
                        <div className="text-center w-full">
                            <p className="text-gray-600 text-xl mb-3">Mint Price:</p>
                            <p className="font-extrabold text-3xl text-gray-900 mb-6">{collection.mintPrice} {collection.mintCurrency}</p>
                            <Button className="w-full py-4 text-xl bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                Mint Now!
                            </Button>
                        </div>
                    )}

                    {collection.status === 'Ended' && (
                        <div className="text-center w-full">
                            <p className="text-gray-600 text-xl mb-4">Minting for this collection has ended.</p>
                            {collection.externalUrl && (
                                <Link href={collection.externalUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full py-4 text-xl bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                        View on OpenSea
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}

                    {collection.status === 'Coming Soon' && (
                        <div className="text-center w-full">
                            <p className="text-gray-600 text-xl mb-4">This collection is coming soon!</p>
                            <Button className="w-full py-4 text-xl bg-yellow-500 text-white font-bold rounded-lg cursor-not-allowed opacity-70">
                                Notify Me
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bagian untuk NFT dalam koleksi, aktivitas terbaru, dll. bisa ditambahkan di sini */}
            {/* <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">NFTs in this Collection</h2>
                // Grid atau daftar NFT
            </div> */}
        </div>
    );
}