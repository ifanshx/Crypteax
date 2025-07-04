// app/(dashboard)/layout.tsx
import React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';
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
            <DashboardSidebar />
            <div className="flex flex-col flex-1 ml-16">
                <DashboardTopbar />
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