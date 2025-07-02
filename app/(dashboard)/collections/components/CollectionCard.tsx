// components/collections/CollectionCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, Flame, Clock, CheckCircle, Info } from 'lucide-react';
import { Collection } from '@/lib/data/collections';
import { cn } from '@/lib/utils'; // Untuk classnames kondisional

interface CollectionCardProps {
    collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
    let statusIcon;
    let statusColor;
    const statusText = collection.status;

    switch (collection.status) {
        case 'Live':
            statusIcon = <Flame className="w-4 h-4" />;
            statusColor = 'bg-green-600 text-white'; // Sedikit lebih gelap
            break;
        case 'Coming Soon':
            statusIcon = <Clock className="w-4 h-4" />;
            statusColor = 'bg-yellow-600 text-white'; // Sedikit lebih gelap
            break;
        case 'Ended':
            statusIcon = <CheckCircle className="w-4 h-4" />;
            statusColor = 'bg-gray-500 text-white'; // Gray lebih cocok untuk 'Ended'
            break;
        default:
            statusIcon = <Info className="w-4 h-4" />;
            statusColor = 'bg-gray-500 text-white';
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group relative"> {/* shadow-xl, hover:shadow-2xl, relative */}
            {/* Gambar Banner / Thumbnail */}
            <Link href={`/collections/${collection.id}`} passHref>
                <div className="relative w-full h-48 md:h-56 overflow-hidden cursor-pointer"> {/* cursor-pointer */}
                    <Image
                        src={collection.bannerUrl || collection.imageUrl}
                        alt={collection.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110" // Efek scale lebih agresif
                    />
                    {/* Overlay ringan untuk kontras dengan status badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                </div>
            </Link>

            {/* Status Badge */}
            <div className={cn("absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 z-20", statusColor)}> {/* py-1.5, z-20 */}
                {statusIcon}
                <span>{statusText}</span>
            </div>

            {/* Konten Card */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center -mt-16 relative z-30"> {/* -mt-16 untuk logo di atas banner */}
                {/* Logo Koleksi */}
                <div className="relative mb-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-300 group-hover:scale-105"> {/* border-4, shadow-lg, hover:scale-105 */}
                    <Image
                        src={collection.imageUrl}
                        alt={`${collection.name} Logo`}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 truncate w-full px-2">
                    {collection.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{collection.description}</p>

                {/* Informasi Kunci */}
                <div className="grid grid-cols-2 gap-3 w-full text-sm mb-6"> {/* gap-3, mb-6 */}
                    <div className="bg-gray-50 p-1 justify-center items-center text-center flex flex-col rounded-lg border border-gray-200"> {/* bg-gray-50, p-3, border */}
                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Mint Price</p>
                        <p className="font-bold text-gray-800 text-base">{collection.mintPrice || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-1 justify-center items-center text-center flex flex-col rounded-lg border border-gray-200"> {/* bg-gray-50, p-3, border */}
                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Supply</p>
                        <p className="font-bold text-gray-800 text-[12px]">{collection.currentSupply || '0'} / {collection.maxSupply || 'N/A'}</p>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <Link href={`/collections/${collection.id}`} className="w-full">
                    <Button className="w-full py-3 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md transform hover:-translate-y-0.5"> {/* hover:-translate-y-0.5 */}
                        View Collection
                    </Button>
                </Link>
                {collection.externalUrl && (
                    <Link href={collection.externalUrl} target="_blank" rel="noopener noreferrer" className="w-full mt-2">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-3 text-base text-gray-700 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm transform hover:-translate-y-0.5"> {/* shadow-sm, hover:-translate-y-0.5 */}
                            <ExternalLink className="w-4 h-4" /> OpenSea
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}