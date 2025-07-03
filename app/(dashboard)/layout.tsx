// app/(dashboard)/layout.tsx
import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import '../globals.css';
import GasPrice from '@/components/common/GasPrice';


export const metadata = {
    title: 'Cryptea Dashboard',
    description: 'Manage your collections and NFTs with Cryptea.',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 ml-16">
                <Topbar />
                <main className="flex-1 p-6 pt-20">
                    {children}
                    <div className="fixed bottom-6 right-6 z-50 md:bottom-6 md:right-6">
                        <GasPrice />
                    </div>
                </main>
            </div>
        </div>
    );
}