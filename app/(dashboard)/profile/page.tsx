// app/(dashboard)/profile/page.tsx
"use client";
import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatAddress } from '@/lib/helper';
import {
    Loader2Icon,
    Pencil,
    Copy,
    Coins,
    GalleryHorizontal,
    Wallet, // Menambahkan ikon Wallet
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link'; // Import Link

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const toast = useToast();
    const user = session?.user;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // Menggunakan user.username dari sesi sebagai nilai awal, pastikan tidak null
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [isSaving, setIsSaving] = useState(false);

    const copyToClipboard = (text: string, title: string, desc: string) => {
        navigator.clipboard.writeText(text);
        toast.add({ title, description: desc, type: 'success' });
    };

    const handleCopyAddress = () => {
        if (user?.walletAddress) {
            copyToClipboard(
                user.walletAddress,
                'Address Disalin!',
                'Alamat dompet Anda berhasil disalin.'
            );
        }
    };

    const handleCopyReferral = useCallback(() => {
        const code = user?.referralCode;
        if (code) {
            const link = `${window.location.origin}/?ref=${code}`;
            copyToClipboard(
                link,
                'Kode Referral Disalin!',
                `Link referral dengan kode ${code} berhasil disalin.`
            );
        }
    }, [user?.referralCode, copyToClipboard]); // Tambahkan copyToClipboard sebagai dependency

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Update failed');
            }
            toast.add({ title: 'Username Diperbarui!', description: 'Nama pengguna Anda berhasil diubah.', type: 'success' });
            setIsDialogOpen(false);
            // Refresh session jika username berubah, agar UI diperbarui
            // Tidak langsung memanggil update, biar next-auth yang menangani setelah sukses
            // window.location.reload(); // Mungkin terlalu agresif, Next-Auth harusnya revalidate sendiri
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
            toast.add({ title: 'Gagal Memperbarui Username', description: msg, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
                <Loader2Icon className="w-10 h-10 text-primary mb-3 animate-spin" />
                <span className="text-lg font-medium text-muted-foreground">
                    Memuat data profil...
                </span>
            </div>
        );
    }

    if (status === 'unauthenticated' || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 text-center">
                <Wallet className="w-20 h-20 text-blue-500 mb-6" />
                <h2 className="text-3xl font-bold mb-3 text-foreground">
                    Autentikasi Diperlukan
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Silakan hubungkan dompet Anda untuk melihat profil.
                </p>
                {/* Anda bisa menambahkan tombol untuk langsung menghubungkan dompet di sini */}
                {/* <Button onClick={() => signIn()} className="py-3 px-6 text-lg">Hubungkan Dompet</Button> */}
                <Link href="/" passHref>
                    <Button variant="outline" className="py-3 px-6 text-lg">
                        Kembali ke Beranda
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen">
            {/* Header Profil */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-primary/30 shadow-lg transform transition-all duration-300 hover:scale-105">
                        {user.image ? (
                            <AvatarImage src={user.image} alt={user.username || 'Pengguna'} />
                        ) : (
                            <AvatarFallback className="bg-green-100 text-green-700 text-4xl font-bold">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <div className="flex-1 text-center sm:text-left space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                {user.username || 'Tamu'}
                            </CardTitle>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-3 sm:mt-0 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <Pencil className="w-4 h-4 mr-1.5" />
                                        <span>Edit</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Edit Username</DialogTitle>
                                        <DialogDescription className="text-muted-foreground">Ubah nama tampilan Anda.</DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Username Baru
                                        </label>
                                        <Input
                                            id="username"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Masukkan username baru..."
                                        />
                                    </div>
                                    <DialogFooter className="mt-6 flex-row-reverse sm:justify-end gap-2">
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-4 py-2">
                                            Batal
                                        </Button>
                                        <Button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                                            {isSaving ? (
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                'Simpan'
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <CardDescription className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-base text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Dompet:</span>
                            <span className="font-mono bg-muted/60 px-3 py-1 rounded-full break-all text-sm shadow-inner">
                                {formatAddress(user.walletAddress)}
                            </span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCopyAddress}
                                            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                                        >
                                            <Copy className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Salin alamat dompet</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardDescription>

                        <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-2">
                            <Badge className="flex items-center px-4 py-2 text-base bg-green-100 text-green-700 shadow-md hover:shadow-lg transition-all duration-200">
                                <Coins className="w-4 h-4 mr-2" />
                                {user.points ?? 0} Poin
                            </Badge>
                            <Badge
                                onClick={handleCopyReferral}
                                className="flex items-center px-4 py-2 text-base bg-secondary text-secondary-foreground shadow-md cursor-pointer hover:bg-secondary/90 hover:shadow-lg transition-all duration-200"
                            >
                                Kode Referral: <span className="font-mono ml-2">{user.referralCode || 'N/A'}</span>
                                <Copy className="w-4 h-4 ml-2" />
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </div>

            {/* Konten Utama */}
            <CardContent className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3">Koleksi & NFT Saya</h3>
                <div className="bg-card p-8 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 text-center space-y-4">
                    <GalleryHorizontal className="w-16 h-16 mx-auto text-muted-foreground opacity-70" />
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Belum ada koleksi atau NFT.</p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        Item NFT yang Anda miliki atau koleksi yang Anda buat akan muncul di sini.
                        Jelajahi pasar atau buat koleksi pertama Anda!
                    </p>
                    <Link href="/collections" passHref>
                        <Button className="mt-4 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-md transform hover:scale-105 transition-all duration-300">
                            Jelajahi Koleksi
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </div>
    );
}