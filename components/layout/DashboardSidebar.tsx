// components/layout/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { Rocket, Repeat2, Image, PartyPopper, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export function DashboardSidebar() {
    const { data: session } = useSession();

    const navItems = [
        { icon: Rocket, label: 'Home', href: '/home' },
        { icon: Image, label: 'Collections', href: '/collections' },
        { icon: Repeat2, label: 'Stake', href: '/stake' },
        { icon: PartyPopper, label: 'Raffle', href: '/raffle' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex-col items-center py-4 space-y-8 z-50 hidden md:flex justify-between">
            <div>
                <div className="mb-8 mt-0">
                    <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DAF4E3] text-[#2F855A] text-2xl font-bold">
                        🌱
                    </Link>
                </div>

                <nav className="flex flex-col space-y-6">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "p-2 rounded-lg transition-colors flex items-center justify-center",
                            )}
                            title={item.label}
                        >
                            <item.icon className="h-6 w-6 text-gray-500" />
                        </Link>
                    ))}
                </nav>
            </div>

            {session?.user?.role === 'ADMIN' && (
                <nav className="flex flex-col space-y-6 mb-4">
                    <Link
                        href="/admin"
                        className={cn(
                            "p-2 rounded-lg transition-colors flex items-center justify-center",
                        )}
                        title="Admin"
                    >
                        <UserCog className="h-6 w-6 text-gray-500" />
                    </Link>
                </nav>
            )}
        </aside>
    );
}