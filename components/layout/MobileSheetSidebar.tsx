// components/layout/MobileSheetSidebar.tsx
'use client'; // Tambahkan baris ini

import Link from 'next/link';
import { Rocket, Repeat2, Image, PartyPopper, Menu, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import { useSession } from 'next-auth/react';

export function MobileSheetSidebar() {
    const { data: session } = useSession(); // Get the session

    const navItems = [
        { icon: Rocket, label: 'Home', href: '/home' },
        { icon: Image, label: 'Collections', href: '/collections' },
        { icon: Repeat2, label: 'Stake', href: '/stake' },
        { icon: PartyPopper, label: 'Raffle', href: '/raffle' },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild className="md:hidden">
                <button className="p-2 -ml-2 rounded-md hover:bg-gray-100 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <Menu className="h-6 w-6 text-gray-600" />
                    <span className="sr-only">Toggle sidebar</span>
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0 bg-white border-r-0 flex flex-col"> {/* Tambahkan flex flex-col */}
                <SheetHeader className="sr-only">
                    <SheetTitle>Main Navigation</SheetTitle>
                    <SheetDescription>
                        Navigation menu for Cryptea Dashboard.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col items-center py-4 space-y-8 flex-grow"> {/* flex-grow agar konten atas memenuhi ruang yang tersedia */}
                    <div className="mb-8 mt-0 flex items-center gap-3">
                        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DAF4E3] text-[#2F855A] text-2xl font-bold">
                            🌱
                        </Link>
                        <span className="text-xl font-medium">Cryptea</span>
                    </div>

                    <nav className="flex flex-col space-y-6 w-full px-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "p-2 rounded-lg transition-colors flex items-center gap-3 w-full",
                                    "hover:bg-gray-100 text-gray-700"
                                )}
                            >
                                <item.icon className="h-5 w-5 text-gray-500" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bagian bawah untuk item Admin */}
                {session?.user?.role === 'ADMIN' && (
                    <nav className="flex flex-col space-y-6 w-full px-4 mb-4"> {/* mb-4 untuk sedikit padding dari bawah */}
                        <Link
                            href="/admin"
                            className={cn(
                                "p-2 rounded-lg transition-colors flex items-center gap-3 w-full",
                                "hover:bg-gray-100 text-gray-700"
                            )}
                        >
                            <UserCog className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium">Admin</span>
                        </Link>
                    </nav>
                )}
            </SheetContent>
        </Sheet>
    );
}