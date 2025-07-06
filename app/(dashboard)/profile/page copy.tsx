// app/(dashboard)/profile/page.tsx
"use client";
import React from 'react';
import { useSession } from 'next-auth/react';

import {
    CardContent,
    CardHeader,
    CardTitle,
    Card
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator'; // Import Separator

import { formatAddress } from '@/lib/helper';

import { Loader2Icon, Pencil, Copy, QrCode, Coins, GalleryHorizontal } from 'lucide-react';

import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const toast = useToast();

    // Pastikan komponen Separator sudah tersedia. Jika belum, kamu bisa menambahkannya ke UI library-mu.
    // Contoh implementasi sederhana jika belum ada:
    // components/ui/separator.tsx
    // import * as React from "react"
    // import * as SeparatorPrimitive from "@radix-ui/react-separator"
    // import { cn } from "@/lib/utils" // Asumsi ada utilitas cn

    // const Separator = React.forwardRef<
    //   React.ElementRef<typeof SeparatorPrimitive.Root>,
    //   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
    // >(
    //   ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    //     <SeparatorPrimitive.Root
    //       ref={ref}
    //       decorative={decorative}
    //       orientation={orientation}
    //       className={cn(
    //         "shrink-0 bg-border",
    //         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
    //         className
    //       )}
    //       {...props}
    //     />
    //   )
    // )
    // Separator.displayName = SeparatorPrimitive.Root.displayName


    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-muted-foreground">
                <p className="text-xl font-semibold mb-4">You are not logged in.</p>
                <p>Please connect your wallet to view your profile.</p>
            </div>
        );
    }

    const user = session?.user;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-muted-foreground">
                <p className="text-xl font-semibold mb-4">User data not found.</p>
                <p>Please try again or contact support.</p>
            </div>
        );
    }

    const handleCopyAddress = () => {
        if (user.walletAddress) {
            navigator.clipboard.writeText(user.walletAddress);
            toast.add({
                title: "Address Copied!",
                description: "Wallet address copied to clipboard.",
                type: "success",
            });
        }
    };

    const handleShowQrCode = () => {
        toast.add({
            title: "QR Code Feature",
            description: "QR Code display is coming soon!",
            type: "info",
        });
    };

    const handleCopyReferralCode = () => {
        if (user.referralCode) {
            navigator.clipboard.writeText(user.referralCode);
            toast.add({
                title: "Referral Code Copied!",
                description: "Your referral code has been copied to clipboard.",
                type: "success",
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-4xl">
            <Card className="p-0 border-none shadow-none bg-transparent">
                <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 relative">
                        <Avatar className="size-28 sm:size-32 border-4 border-primary/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                            {user.image ? (
                                <AvatarImage src={user.image} alt={user.username || "User"} />
                            ) : (
                                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-0 right-0 -mr-2 -mb-2 rounded-full size-8 shadow-md"
                            aria-label="Edit avatar"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* User Info Section */}
                    <div className="text-center sm:text-left flex-grow space-y-2 sm:space-y-3">
                        <CardTitle className="text-3xl lg:text-4xl font-extrabold text-foreground">
                            {user.username || "Guest User"}
                        </CardTitle>

                        {/* Wallet Address */}
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
                            <span className="text-muted-foreground text-lg">Wallet:</span>
                            <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-md">
                                <span className="font-mono text-foreground break-all text-sm sm:text-base">
                                    {formatAddress(user.walletAddress)}
                                </span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCopyAddress}
                                                className="h-7 w-7 text-muted-foreground hover:bg-accent/50"
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
                                                className="h-7 w-7 text-muted-foreground hover:bg-accent/50"
                                                aria-label="Show QR Code"
                                            >
                                                <QrCode className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Show QR Code</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        {/* Referral Info */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                            <Badge className="bg-primary text-primary-foreground text-sm py-1 px-3">
                                <Coins className="h-4 w-4 text-orange-300 mr-1" />
                                Referral Points: <span className="ml-1 font-bold">1250</span> {/* Contoh data statis */}
                            </Badge>
                            <Badge
                                className="bg-secondary text-secondary-foreground text-sm py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
                                onClick={handleCopyReferralCode}
                            >
                                <p className="font-medium mr-1">Your Code:</p>
                                <p className="text-base font-bold text-green-600 dark:text-green-400 tracking-tight">{user.referralCode || 'N/A'}</p>
                                <Copy className="h-3 w-3 ml-2 text-muted-foreground" />
                            </Badge>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="flex-shrink-0 mt-4 sm:mt-0">
                        <Button variant="default" className="flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 md:text-base">
                            <Pencil className="h-4 w-4" /> Edit Profile
                        </Button>
                    </div>
                </CardHeader>

                <Separator className="my-8" /> {/* Menambahkan Separator */}

                <CardContent className="pt-0">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">My Collections & NFTs</h3>
                    <div className="bg-card p-6 py-10 rounded-lg shadow-md border border-border text-center text-muted-foreground flex flex-col items-center justify-center">
                        <GalleryHorizontal className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-base mb-2">Your owned collections and NFTs will appear here soon!</p>
                        <p className="text-sm">Stay tuned for exciting updates.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}