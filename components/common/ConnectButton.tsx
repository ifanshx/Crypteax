'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Loader2Icon, ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip components

/**
 * @name ConnectButton
 * @description Komponen tombol untuk menghubungkan atau memutuskan koneksi wallet.
 * Menangani state loading dan rendering yang berbeda antara SSR dan klien.
 */
export const ConnectButton = () => {
    // Hooks dari AppKit untuk fungsionalitas koneksi wallet
    const { open } = useAppKit();
    const { address, isConnected, status } = useAppKitAccount();
    const { disconnect } = useDisconnect();

    // State untuk melacak apakah komponen sudah mounted di sisi klien (untuk hidrasi)
    const [mounted, setMounted] = useState(false);

    // Efek samping untuk menandai komponen telah mounted setelah render pertama di klien
    useEffect(() => {
        setMounted(true);
    }, []);

    // Menentukan status loading berdasarkan status koneksi AppKit
    // 'connecting' atau 'reconnecting' dianggap sebagai loading
    const isLoading = status === 'connecting' || status === 'reconnecting';

    /**
     * @function handleConnectClick
     * @description Menangani aksi klik pada tombol "Connect Wallet".
     */
    const handleConnectClick = () => {
        open({ view: 'Connect', namespace: 'eip155' });
    };

    /**
     * @function handleDisconnectClick
     * @description Menangani aksi klik pada tombol "Disconnect".
     */
    const handleDisconnectClick = () => {
        disconnect();
    };

    // --- Rendering Conditional Berdasarkan Mounted State ---

    // Selama SSR atau sebelum komponen dihidrasi di klien, tampilkan placeholder.
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="sm"
                disabled={false}
            >
                <ChevronDown className="mr-1 h-4 w-4" />
                Connect Wallet
            </Button>
        );
    }

    // Setelah mounted di sisi klien, render tampilan yang dinamis.
    return (
        <div className="flex items-center space-x-2"> {/* Tambahkan div pembungkus untuk mengatur layout */}
            <TooltipProvider> {/* Wrap with TooltipProvider */}
                {isConnected && address ? (
                    // Jika terhubung, tampilkan gambar profil dan tombol disconnect
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/profile" passHref>
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-gray-300 hover:border-blue-500 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"> {/* Added hover/focus effects */}
                                        <Image
                                            src="/assets/avatars/user-placeholder.png" // Ganti dengan path gambar profil asli jika ada
                                            alt="Profile"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Profile</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleDisconnectClick}
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Disconnect Wallet"
                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Added hover/focus effects
                                >
                                    <LogOut className="h-5 w-5 text-gray-500 hover:text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Disconnect Wallet</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                ) : (
                    // Jika belum terhubung, tampilkan tombol "Connect Wallet"
                    <Button
                        onClick={handleConnectClick}
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Connecting…
                            </>
                        ) : (
                            <>
                                Connect Wallet
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                        )}
                    </Button>
                )}
            </TooltipProvider>
        </div>
    );
};