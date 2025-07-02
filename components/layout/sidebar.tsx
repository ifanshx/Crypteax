import Link from 'next/link';
import { Rocket, Repeat2, Image, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const navItems = [
        { icon: Rocket, label: 'Rocket', href: '/home' },
        { icon: Image, label: 'Image', href: '/collections' },
        { icon: Repeat2, label: 'Repeat', href: '/stake' },
        { icon: PartyPopper, label: 'Repeat', href: '/raffle' },

    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-8 z-100">
            <div className="mb-8 mt-0"> {/* mt-2 untuk sedikit geser ke bawah */}
                <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DAF4E3] text-[#2F855A] text-2xl font-bold">
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
        </aside>
    );
}