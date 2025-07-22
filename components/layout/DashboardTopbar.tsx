// components/layout/DashboardTopbar.tsx
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
import { MobileSheetSidebar } from './MobileSheetSidebar';
import { useBalance } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatBalance } from '@/lib/helper'; // Import formatBalance from helper
import { formatUnits } from 'viem'; // Import formatUnits from viem for converting bigint to string with decimals

export function DashboardTopbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const allCollections = React.useMemo(() => getAllCollections(), []);

    // Get connected wallet address
    const { address, isConnected } = useAppKitAccount();

    // Ensure the address is explicitly typed as `0x${string}` or undefined
    const walletAddress = address as `0x${string}` | undefined; // Type assertion here

    // Fetch TEA balance for the connected wallet
    const { data: teaBalance, isLoading: isTeaBalanceLoading } = useBalance({
        address: walletAddress, // Use the type-asserted walletAddress
        chainId: 10218, // Tea Sepolia Testnet Chain ID
        query: {
            enabled: isConnected && !!walletAddress, // Only fetch if wallet is connected and address is available
            refetchInterval: 30_000, // Refresh every 30 seconds
        },
    });

    useEffect(() => {
        if (searchTerm.length > 0 && searchTerm !== debouncedSearchTerm) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }

        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

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
        setIsSearching(false);
    }, [debouncedSearchTerm, allCollections]);

    const handleSelectCollection = useCallback((collectionId: string) => {
        setIsPopoverOpen(false);
        setSearchTerm('');
        router.push(`/collections/${collectionId}`);
    }, [router]);

    return (
        <header className="fixed left-0 md:left-16 top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
            <MobileSheetSidebar />

            <div className="relative flex items-center flex-grow max-w-sm mr-4">
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
                            <div role="listbox" className="flex flex-col">
                                {filteredCollections.map((collection) => (
                                    <button
                                        key={collection.id}
                                        onClick={() => handleSelectCollection(collection.id)}
                                        className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer w-full text-left"
                                        role="option"
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
                            <div className="p-4 text-center text-sm text-muted-foreground">
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

            <div className="flex items-center space-x-3 sm:space-x-4 mr-2 sm:mr-4">
                {/* CTEA Balance (remains hardcoded as contract address is unavailable) */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block cursor-default">0.00 CTEA</span>
                {/* TEA Balance (now dynamic) */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block cursor-default">
                    {isTeaBalanceLoading ? (
                        <Loader2Icon className="h-4 w-4 animate-spin inline-block mr-1" />
                    ) : teaBalance ? (
                        `${formatBalance(formatUnits(teaBalance.value, teaBalance.decimals), 2, 4)} ${teaBalance.symbol}`
                    ) : (
                        '0.00 TEA'
                    )}
                </span>
                <ConnectButton />
            </div>
        </header>
    );
}