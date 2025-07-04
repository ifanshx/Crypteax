// app/(dashboard)/profile/page.tsx
"use client";
import React from 'react';
import { useSession } from 'next-auth/react'; // Mengimpor hook useSession untuk data sesi pengguna

// Mengimpor komponen UI dari shadcn/ui
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// Mengimpor komponen Tooltip untuk umpan balik interaksi
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mengimpor fungsi helper untuk memformat alamat
import { formatAddress } from '@/lib/helper';

// Mengimpor ikon dari lucide-react untuk tampilan yang lebih profesional
import { Loader2Icon, Pencil, Copy, QrCode } from 'lucide-react';

// Mengimpor hook useToast untuk notifikasi
import { useToast } from '@/context/ToastContext';

const ProfilePage = () => {
    // Mengambil data sesi dan status autentikasi
    const { data: session, status } = useSession();
    const toast = useToast(); // Menginisialisasi hook toast untuk notifikasi

    // Tampilkan loading state saat sesi sedang dimuat
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2 text-gray-600">Loading profile...</p>
            </div>
        );
    }

    // Tampilkan pesan jika pengguna belum login (unauthenticated)
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
                <p className="text-xl font-semibold mb-4">You are not logged in.</p>
                <p>Please connect your wallet to view your profile.</p>
            </div>
        );
    }

    // Ambil data pengguna dari sesi
    const user = session?.user;

    // Tampilkan pesan jika data pengguna tidak ditemukan setelah autentikasi (misal: error sesi)
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
                <p className="text-xl font-semibold mb-4">User data not found.</p>
                <p>Please try again or contact support.</p>
            </div>
        );
    }

    // Fungsi untuk menyalin alamat wallet ke clipboard
    const handleCopyAddress = () => {
        if (user.walletAddress) {
            navigator.clipboard.writeText(user.walletAddress);
            // Menampilkan notifikasi toast sukses
            toast.add({
                title: "Address Copied!",
                description: "Wallet address copied to clipboard.",
                type: "success",
            });
        }
    };

    // Placeholder untuk fungsionalitas menampilkan QR Code (akan datang)
    const handleShowQrCode = () => {
        // Menampilkan notifikasi toast informasi
        toast.add({
            title: "QR Code Feature",
            description: "QR Code display is coming soon!",
            type: "info",
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                <Avatar className="size-28 sm:size-32 border-4 border-blue-100 shadow-md">
                    {/* Menampilkan gambar profil jika ada, atau fallback dengan inisial nama pengguna */}
                    {user.image ? (
                        <AvatarImage src={user.image} alt={user.username || "User"} />
                    ) : (
                        <AvatarFallback className="text-4xl font-bold bg-blue-500 text-white">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="text-center sm:text-left flex-grow">
                    <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2">
                        {user.username || "Guest User"}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 mb-2">
                        Wallet Address:
                        <span className="font-mono text-gray-800 text-base break-all">
                            {formatAddress(user.walletAddress)} {/* Memformat alamat wallet */}
                        </span>
                        <TooltipProvider> {/* Pembungkus Tooltip untuk tombol-tombol aksi */}
                            <div className="flex items-center gap-1 mt-2 sm:mt-0">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCopyAddress}
                                            className="h-7 w-7 text-gray-500 hover:bg-gray-100"
                                            aria-label="Copy wallet address"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Copy Address</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleShowQrCode}
                                            className="h-7 w-7 text-gray-500 hover:bg-gray-100"
                                            aria-label="Show QR Code"
                                        >
                                            <QrCode className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Show QR Code</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </CardDescription>
                    <Badge className="bg-blue-500 text-white text-md py-1 px-3 mt-2">
                        Role: {user.role} {/* Menampilkan role pengguna */}
                    </Badge>
                </div>
                {/* Tombol Edit Profile sebagai placeholder */}
                <Button variant="outline" className="flex items-center gap-2 px-6 py-2 mt-4 sm:mt-0">
                    <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
            </CardHeader>

            <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div>
                        <p className="font-medium">Referral Points:</p>
                        <p className="text-lg font-bold text-blue-700">{user.points?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Your Referral Code:</p>
                        <p className="text-lg font-bold text-green-700">{user.referralCode || 'N/A'}</p>
                    </div>
                </div>

                <Separator className="my-8" /> {/* Pemisah visual */}

            </CardContent>
        </div>
    );
};

export default ProfilePage;