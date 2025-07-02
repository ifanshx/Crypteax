'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Loader2Icon, ChevronDown } from 'lucide-react';

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
     * @function handleClick
     * @description Menangani aksi klik pada tombol.
     * Jika sudah terhubung, panggil `disconnect()`.
     * Jika belum terhubung, buka modal koneksi wallet.
     */
    const handleClick = () => {
        if (isConnected) {
            disconnect();
        } else {
            open({ view: 'Connect', namespace: 'eip155' });
        }
    };

    // --- Rendering Conditional Berdasarkan Mounted State ---

    // Selama SSR atau sebelum komponen dihidrasi di klien, tampilkan placeholder.
    // Ini mencegah mismatch hidrasi karena hooks seperti useAppKitAccount() hanya tersedia di klien.
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="sm"
                disabled={false} // Selalu false di SSR untuk menghindari disabled={true}
            >
                <ChevronDown className="mr-1 h-4 w-4" />
                Connect Wallet {/* Tampilan default atau placeholder di SSR */}
            </Button>
        );
    }

    // Setelah mounted di sisi klien, render tombol interaktif.
    return (
        <Button
            onClick={handleClick}
            variant="ghost" // Menggunakan variant ghost secara konsisten
            size="sm"
            disabled={isLoading} // Tombol dinonaktifkan saat loading
        >
            {isLoading ? (
                // Tampilan saat loading: ikon spinner dan teks "Connecting..."
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Connecting…
                </>
            ) : (
                // Tampilan normal: ikon panah dan teks berdasarkan status koneksi
                <>

                    {isConnected && address
                        ? `Disconnect` // Teks tombol "Disconnect" jika sudah terhubung
                        : 'Connect Wallet'} {/* Teks tombol "Connect Wallet" jika belum terhubung */}
                    <ChevronDown className="ml-1 h-4 w-4" />
                </>
            )}
        </Button>
    );
};