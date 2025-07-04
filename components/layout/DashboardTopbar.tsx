'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2Icon } from 'lucide-react';
import { ConnectButton } from '../common/ConnectButton';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { getAllCollections, Collection } from '@/lib/data/collections';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function DashboardTopbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const allCollections = React.useMemo(() => getAllCollections(), []);

    // Efek untuk melakukan debouncing pada searchTerm dan mengelola status loading
    useEffect(() => {
        // Atur isSearching menjadi true jika ada input dan belum ter-debounce
        if (searchTerm.length > 0 && searchTerm !== debouncedSearchTerm) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }

        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // Debounce delay 300ms

        return () => {
            clearTimeout(handler);
            // setIsSearching(false); // Tidak perlu di sini, karena sudah ditangani di bawah
        };
    }, [searchTerm]);

    // Efek untuk memfilter koleksi berdasarkan debouncedSearchTerm
    useEffect(() => {
        if (debouncedSearchTerm.length > 0) {
            const results = allCollections.filter(
                (collection) =>
                    collection.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    (collection.description && collection.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            );
            setFilteredCollections(results);
            setIsPopoverOpen(true);
        } else {
            setFilteredCollections([]);
            setIsPopoverOpen(false);
        }
        setIsSearching(false); // Pastikan isSearching false setelah hasil diproses
    }, [debouncedSearchTerm, allCollections]);

    const handleSelectCollection = useCallback((collectionId: string) => {
        setIsPopoverOpen(false);
        setSearchTerm('');
        router.push(`/collections/${collectionId}`);
    }, [router]);

    return (
        <header className="fixed left-16 top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
            <div className="relative flex items-center flex-grow max-w-sm ml-4">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <div className="relative w-full">
                            {isSearching ? (
                                <Loader2Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                            ) : (
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            )}
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Search Collection..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-400 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm.length > 0 && setIsPopoverOpen(true)}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0 mt-2 max-h-60 overflow-y-auto"
                        onOpenAutoFocus={(event) => {
                            event.preventDefault();
                            inputRef.current?.focus();
                        }}
                    >
                        {filteredCollections.length > 0 ? (
                            <div role="listbox" className="flex flex-col"> {/* Tambahkan role="listbox" */}
                                {filteredCollections.map((collection) => (
                                    <button
                                        key={collection.id}
                                        onClick={() => handleSelectCollection(collection.id)}
                                        className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer w-full text-left"
                                        role="option" // Tambahkan role="option"
                                        aria-selected="false"
                                    >
                                        <Image
                                            src={collection.imageUrl}
                                            alt={collection.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full object-cover w-6 h-6"
                                        />
                                        <span>{collection.name}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground"> {/* Ubah jadi div untuk styling lebih baik */}
                                {isSearching ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2Icon className="h-4 w-4 animate-spin" /> Searching...
                                    </span>
                                ) : (
                                    <span>No collections found.</span>
                                )}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex items-center space-x-5 mr-4">
                <span className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-default">0.00 CTEA</span>
                <span className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-default">0.00 TEA</span>
                <ConnectButton />
            </div>
        </header>
    );
}