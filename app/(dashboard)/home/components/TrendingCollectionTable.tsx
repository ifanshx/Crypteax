// components/dashboard/TrendingCollectionTable.tsx
import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';

// Definisikan tipe data untuk koleksi
interface CollectionData {
    id: string;
    name: string;
    image: string;
    floor: string;
    floorChange: number; // Persentase perubahan, e.g., 0, 5, -2
    volume24h: string;
    volume24hChange: number;
    totalVolume: string;
    totalVolumeChange: number;
    owners: string;
    supply: string;
}

interface TrendingCollectionTableProps {
    collections: CollectionData[];
}

export function TrendingCollectionTable({ collections }: TrendingCollectionTableProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Trending Collection</h2>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 text-gray-600">
                        <TableHead className="w-[200px] py-3 text-left font-semibold text-sm">Name</TableHead>
                        <TableHead className="text-right py-3 font-semibold text-sm">
                            <div className="flex items-center justify-end space-x-1">
                                <span>Floor</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right py-3 font-semibold text-sm">
                            <div className="flex items-center justify-end space-x-1">
                                <span>24h Volume</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right py-3 font-semibold text-sm">
                            <div className="flex items-center justify-end space-x-1">
                                <span>Total Volume</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right py-3 font-semibold text-sm">
                            <div className="flex items-center justify-end space-x-1">
                                <span>Owners</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right py-3 font-semibold text-sm">
                            <div className="flex items-center justify-end space-x-1">
                                <span>Supply</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {collections.map((collection) => (
                        <TableRow key={collection.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium flex items-center space-x-3 py-4">
                                <Avatar>
                                    <AvatarImage src={collection.image} alt={collection.name} />
                                    <AvatarFallback>{collection.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Link href={`/collections/${collection.id}`} className="text-gray-800 hover:underline">
                                    {collection.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold">{collection.floor}</span>
                                    <span className={`text-xs ${collection.floorChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {collection.floorChange >= 0 ? '+' : ''}{collection.floorChange}%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold">{collection.volume24h}</span>
                                    <span className={`text-xs ${collection.volume24hChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {collection.volume24hChange >= 0 ? '+' : ''}{collection.volume24hChange}%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold">{collection.totalVolume}</span>
                                    <span className={`text-xs ${collection.totalVolumeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {collection.totalVolumeChange >= 0 ? '+' : ''}{collection.totalVolumeChange}%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{collection.owners}</TableCell>
                            <TableCell className="text-right">{collection.supply}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}