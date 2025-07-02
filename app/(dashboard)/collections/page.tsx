// app/(dashboard)/collections/page.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Pastikan Button diimport
import { Search, Flame, Clock, CheckCircle } from 'lucide-react'; // Tambahan ikon untuk filter
import { getAllCollections } from '@/lib/data/collections'; // Import Collection interface
import { CollectionCard } from './components/CollectionCard'; // Sesuaikan path jika berbeda

const CollectionsPage = () => {
    const allCollections = useMemo(() => getAllCollections(), []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Live' | 'Coming Soon' | 'Ended'>('All');

    // Filter koleksi berdasarkan search term DAN status
    const filteredCollections = useMemo(() => {
        let collections = allCollections;

        // Filter berdasarkan status
        if (filterStatus !== 'All') {
            collections = collections.filter(collection => collection.status === filterStatus);
        }

        // Filter berdasarkan search term
        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            collections = collections.filter(collection =>
                collection.name.toLowerCase().includes(lowercasedSearchTerm) ||
                (collection.description && collection.description.toLowerCase().includes(lowercasedSearchTerm)) // Handle optional description
            );
        }
        return collections;
    }, [allCollections, searchTerm, filterStatus]);

    return (
        <div className="flex flex-col gap-10"> {/* Meningkatkan gap antar bagian */}

            <div className="p-6 lg:px-10 flex flex-col gap-8"> {/* Padding untuk konten utama */}
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto w-full mb-4"> {/* Meningkatkan max-w */}
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search collections by name or description..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
                    <Button
                        variant={filterStatus === 'All' ? 'default' : 'outline'}
                        className={filterStatus === 'All' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}
                        onClick={() => setFilterStatus('All')}
                    >
                        All Collections
                    </Button>
                    <Button
                        variant={filterStatus === 'Live' ? 'default' : 'outline'}
                        className={filterStatus === 'Live' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}
                        onClick={() => setFilterStatus('Live')}
                    >
                        <Flame className="w-4 h-4 mr-2" /> Live
                    </Button>
                    <Button
                        variant={filterStatus === 'Coming Soon' ? 'default' : 'outline'}
                        className={filterStatus === 'Coming Soon' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}
                        onClick={() => setFilterStatus('Coming Soon')}
                    >
                        <Clock className="w-4 h-4 mr-2" /> Coming Soon
                    </Button>
                    <Button
                        variant={filterStatus === 'Ended' ? 'default' : 'outline'}
                        className={filterStatus === 'Ended' ? 'bg-red-600 text-white hover:bg-red-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}
                        onClick={() => setFilterStatus('Ended')}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" /> Ended
                    </Button>
                </div>

                {/* Grid Koleksi */}
                {filteredCollections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCollections.map((collection) => (
                            <CollectionCard key={collection.id} collection={collection} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-2xl shadow-lg">
                        <p className="text-xl text-gray-600 font-semibold mb-2">No collections found.</p>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;