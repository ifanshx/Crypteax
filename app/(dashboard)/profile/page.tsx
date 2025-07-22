// app/(dashboard)/profile/page.tsx
"use client"; // Client Component karena menggunakan hooks React dan interaksi UI

import React, { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Menggunakan useSession dari NextAuth.js untuk sesi
import { useRouter } from 'next/navigation'; // Import useRouter untuk router.refresh()

// Import Server Actions yang telah Anda buat
// Pastikan path ini sesuai dengan lokasi Server Actions Anda
import { updateUsername, updateProfileImage } from '@/lib/action/user';

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
    Wallet,
    Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import Image from 'next/image';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
    // Menggunakan `update` dari useSession untuk memicu re-fetch sesi
    const { data: session, status, update } = useSession();
    const toast = useToast();
    const user = session?.user;
    const router = useRouter(); // Inisialisasi useRouter untuk me-refresh rute

    // State untuk Dialog Edit Username
    const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [isSavingUsername, setIsSavingUsername] = useState(false);

    // State untuk Dialog Edit Image
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    // Mengatur default image saat ini atau '/assets/avatars/avatar.png' jika kosong
    const [newImageUrl, setNewImageUrl] = useState(user?.image || '/assets/avatars/avatar.png');
    const [isSavingImage, setIsSavingImage] = useState(false);



    // Daftar gambar avatar yang tersedia
    const availableAvatars = [
        '/assets/avatars/avatar.png',
        '/assets/avatars/avatar2.png',
        '/assets/avatars/avatar3.png',
    ];

    // Effect untuk sinkronisasi state input dialog dengan sesi user saat dialog dibuka
    // Ini penting agar dialog selalu menampilkan nilai sesi terbaru
    useEffect(() => {
        if (isUsernameDialogOpen) {
            setNewUsername(user?.username || '');
        }
    }, [isUsernameDialogOpen, user?.username]);

    useEffect(() => {
        if (isImageDialogOpen) {
            setNewImageUrl(user?.image || '/assets/avatars/avatar.png');
        }
    }, [isImageDialogOpen, user?.image]);


    // Fungsi untuk menyalin ke clipboard dengan feedback toast
    const copyToClipboard = (text: string, title: string, desc: string) => {
        navigator.clipboard.writeText(text);
        toast.add({ title, description: desc, type: 'success' });
    };

    // Handler untuk menyalin alamat dompet utama
    const handleCopyAddress = () => {
        if (user?.walletAddress) {
            copyToClipboard(
                user.walletAddress,
                'Alamat Disalin!',
                'Alamat dompet Anda berhasil disalin.'
            );
        }
    };

    // Handler untuk menyalin link referral
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
    }, [user?.referralCode, toast]); // Menambahkan toast sebagai dependency


    // Handler untuk menyimpan username yang diupdate
    const handleSaveUsername = async () => {
        setIsSavingUsername(true);
        const formData = new FormData();
        formData.append('username', newUsername);

        try {
            const result = await updateUsername(formData); // Memanggil Server Action

            if (result.success) {
                toast.add({ title: 'Username Diperbarui!', description: result.message, type: 'success' });
                setIsUsernameDialogOpen(false);
                await update(); // Memperbarui sesi di client-side
                router.refresh(); // Memaksa refresh data halaman dari server untuk memastikan UI terbaru
            } else {
                toast.add({ title: 'Gagal Memperbarui Username', description: result.message, type: 'error' });
            }
        } catch (err) {
            let msg = 'Terjadi kesalahan yang tidak diketahui.';
            if (err instanceof Error) {
                if (err.message === 'UNAUTHORIZED') {
                    msg = 'Anda tidak terautentikasi atau sesi Anda telah berakhir. Silakan login kembali.';
                } else {
                    msg = err.message;
                }
            }
            console.error("Error in handleSaveUsername (client-side):", err);
            toast.add({ title: 'Gagal Memperbarui Username', description: msg, type: 'error' });
        } finally {
            setIsSavingUsername(false);
        }
    };

    // Handler untuk menyimpan gambar profil yang diupdate
    const handleSaveProfileImage = async () => {
        setIsSavingImage(true);
        const formData = new FormData();
        formData.append('imageUrl', newImageUrl); // Mengirim URL gambar yang dipilih

        try {
            const result = await updateProfileImage(formData); // Memanggil Server Action

            if (result.success) {
                toast.add({ title: 'Foto Profil Diperbarui!', description: result.message, type: 'success' });
                setIsImageDialogOpen(false);
                await update(); // Memperbarui sesi di client-side
                router.refresh(); // Memaksa refresh data halaman dari server untuk memastikan UI terbaru
            } else {
                toast.add({ title: 'Gagal Memperbarui Foto Profil', description: result.message, type: 'error' });
            }
        } catch (err) {
            let msg = 'Terjadi kesalahan yang tidak diketahui.';
            if (err instanceof Error) {
                if (err.message === 'UNAUTHORIZED') {
                    msg = 'Anda tidak terautentikasi atau sesi Anda telah berakhir. Silakan login kembali.';
                } else {
                    msg = err.message;
                }
            }
            console.error("Error in handleSaveProfileImage (client-side):", err);
            toast.add({ title: 'Gagal Memperbarui Foto Profil', description: msg, type: 'error' });
        } finally {
            setIsSavingImage(false);
        }
    };



    // Tampilan Loading saat sesi dimuat
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

    // Tampilan jika pengguna belum terautentikasi atau sesi tidak ada
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
                <Link href="/" passHref>
                    <Button variant="outline" className="py-3 px-6 text-lg">
                        Kembali ke Beranda
                    </Button>
                </Link>
            </div>
        );
    }

    // Tampilan Profil Utama
    return (
        <div className="container mx-auto min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-primary/30 shadow-lg transform transition-all duration-300 hover:scale-105">
                            {user.image ? (
                                <AvatarImage src={user.image} alt={user.username || "Pengguna"} />
                            ) : (
                                <AvatarFallback className="bg-green-100 text-green-700 text-4xl font-bold">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        {/* Tombol dan Dialog Edit Gambar Profil */}
                        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 md:w-9 md:h-9"
                                    aria-label="Edit Profile Image"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Edit Foto Profil</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">Pilih gambar profil Anda.</DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                    <RadioGroup
                                        value={newImageUrl}
                                        onValueChange={setNewImageUrl}
                                        className="grid grid-cols-3 gap-2"
                                    >
                                        {availableAvatars.map((avatarUrl, index) => (
                                            <div key={index} className="flex flex-col items-center gap-2">
                                                <Label htmlFor={`avatar-${index}`} className="cursor-pointer">
                                                    <Image
                                                        src={avatarUrl}
                                                        alt={`Avatar ${index + 1}`}
                                                        width={96}
                                                        height={96}
                                                        className="rounded-full object-cover border-2 border-transparent data-[state=checked]:border-blue-500 transition-all duration-200 hover:scale-105"
                                                        data-state={newImageUrl === avatarUrl ? 'checked' : 'unchecked'}
                                                    />
                                                </Label>
                                                <RadioGroupItem value={avatarUrl} id={`avatar-${index}`} className="sr-only" />
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <DialogFooter className="mt-6 flex-row-reverse sm:justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsImageDialogOpen(false)}>Batal</Button>
                                    <Button onClick={handleSaveProfileImage} disabled={isSavingImage}>
                                        {isSavingImage ? (<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />) : ('Simpan')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                {user.username || 'Tamu'}
                            </CardTitle>
                            {/* Tombol dan Dialog Edit Username */}
                            <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-3 sm:mt-0 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <Pencil className="w-4 h-4 mr-1.5" />
                                        <span>Edit Username</span>
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
                                        <Button variant="ghost" onClick={() => setIsUsernameDialogOpen(false)} className="px-4 py-2">
                                            Batal
                                        </Button>
                                        <Button onClick={handleSaveUsername} disabled={isSavingUsername} className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                                            {isSavingUsername ? (
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