// app/(dashboard)/layout.tsx
import React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';
import '../globals.css';

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
        // Mengembalikan div pembungkus utama dengan styling flex dan background
        <div className=" min-h-screen bg-gray-50">
            <DashboardSidebar />
            <div className="flex flex-col flex-1 ml-16">
                <DashboardTopbar />
                <main className="flex-1 p-6 pt-20">
                    {children}
                </main>
            </div>
        </div>
    );
}