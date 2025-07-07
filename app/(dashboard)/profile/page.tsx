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
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const toast = useToast();
    const user = session?.user;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const copyToClipboard = (text: string, title: string, desc: string) => {
        navigator.clipboard.writeText(text);
        toast.add({ title, description: desc, type: 'success' });
    };

    const handleCopyAddress = () => {
        if (user?.walletAddress) {
            copyToClipboard(
                user.walletAddress,
                'Address Copied',
                'Wallet address copied.'
            );
        }
    };

    const handleCopyReferral = useCallback(() => {
        const code = user?.referralCode;
        if (code) {
            const link = `${window.location.origin}/?ref=${code}`;
            copyToClipboard(
                link,
                'Referral Copied',
                `Link with code ${code} copied.`
            );
        }
    }, [user?.referralCode]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername }),
            });
            if (!res.ok) throw new Error('Update failed');
            toast.add({ title: 'Username Updated', description: '', type: 'success' });
            setIsDialogOpen(false);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error occurred';
            toast.add({ title: 'Error', description: msg, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2Icon className="w-8 h-8 animate-spin" />
                <span className="ml-3 text-base text-muted-foreground">
                    Loading...
                </span>
            </div>
        );
    }

    if (status === 'unauthenticated' || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
                <h2 className="text-2xl font-semibold mb-2 text-muted-foreground">
                    Not Authenticated
                </h2>
                <p className="text-base text-muted-foreground">
                    Please connect your wallet.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">

            {/* Header */}
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border-b pb-6">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-primary/20 shadow-md">
                    {user.image ? (
                        <AvatarImage src={user.image} alt={user.username || 'User'} />
                    ) : (
                        <AvatarFallback className="bg-green-100 text-green-700 text-3xl font-bold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    )}
                </Avatar>

                <div className="flex-1 text-center sm:text-left space-y-4 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-3xl font-extrabold">
                            {user.username || 'Guest'}
                        </CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Pencil className="w-4 h-4" />
                                    <span className="ml-1">Edit</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Username</DialogTitle>
                                    <DialogDescription>Change your display name.</DialogDescription>
                                </DialogHeader>
                                <div className="mt-2">
                                    <label htmlFor="username" className="block text-sm">
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="mt-1 w-full"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <CardDescription className="flex items-center justify-center sm:justify-start space-x-2 text-sm">
                        <span className="font-medium">Wallet</span>
                        <span className="font-mono bg-muted/50 px-2 py-0.5 rounded break-all">
                            {formatAddress(user.walletAddress)}
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopyAddress}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy address</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardDescription>

                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                        <Badge className="flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground">
                            <Coins className="w-4 h-4 mr-1 text-orange-300" />
                            1250 Points
                        </Badge>
                        <Badge
                            onClick={handleCopyReferral}
                            className="flex items-center px-3 py-1 text-sm bg-secondary text-secondary-foreground cursor-pointer"
                        >
                            Code: {user.referralCode || 'N/A'}
                            <Copy className="w-4 h-4 ml-2" />
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="pt-8">
                <h3 className="text-xl font-semibold mb-4">My Collections & NFTs</h3>
                <div className="bg-card p-6 rounded-lg shadow border text-center space-y-2">
                    <GalleryHorizontal className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-base font-medium">No collections yet.</p>
                    <p className="text-sm text-muted-foreground">
                        Your items will appear here.
                    </p>
                </div>
            </CardContent>
        </div>
    );
}