// components/common/GasPrice.tsx
"use client";
import { useGasPrice } from 'wagmi';
import { formatGwei } from 'viem';
import { formatBalance } from '@/lib/helper'; // Impor formatBalance dari helper
import { Flame } from 'lucide-react';

export const GasPrice = () => {
    const { data, isError, isLoading } = useGasPrice({
        query: {
            enabled: true,
            refetchInterval: 60_000 // Refresh setiap 60 detik
        }
    });

    return (
        <div className='hidden items-center space-x-2 lg:flex'>
            <div className='flex space-x-px'>
                {/* Menggunakan span dengan styling Tailwind */}
                <span className='text-xs'>
                    {isError || isLoading || !data
                        ? '0' // Menggunakan '0' sebagai string default
                        : formatBalance(formatGwei(data), 2, 2)} {/* Memanggil formatBalance */}
                </span>
                <span className='text-xs'>
                    gwei
                </span>
            </div>
            <div>
                <Flame width={18} height={18} className="text-orange-500" /> {/* Menambahkan warna ikon */}
            </div>
        </div>
    );
};

export default GasPrice;