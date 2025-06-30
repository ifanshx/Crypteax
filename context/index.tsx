// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { defineChain } from '@reown/appkit/networks';
import { siweConfig } from '@/config/siweConfig'; // Import siweConfig yang baru dibuat
import { SessionProvider } from 'next-auth/react'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
    throw new Error('Project ID is not defined')
}

const TeaSepolia = defineChain({
    id: 10218,
    caipNetworkId: 'eip155:10218',
    chainNamespace: 'eip155',
    name: "Tea Sepolia Testnet",
    nativeCurrency: { name: "Tea Sepolia Testnet", symbol: "TEA", decimals: 18 },
    rpcUrls: {
        default: {
            http: [
                "https://tea-sepolia.g.alchemy.com/public",
            ],
        },
    },
    blockExplorers: {
        default: { name: "Tea Sepolia Testnet", url: "https://sepolia.tea.xyz" },
    },
    contracts: {
        // Add the contracts here
    }
})

// Set up metadata
const metadata = {
    name: 'Cryptea',
    description: 'Stake, Win, and LFG CRYPTEA!',
    url: 'https://cryptea-vert.vercel.app', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
export const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [TeaSepolia], // Memastikan TeaSepolia ada di sini.
    defaultNetwork: TeaSepolia, // Memastikan TeaSepolia adalah default network.
    metadata: metadata,
    features: {
        analytics: true,
        swaps: false,
        email: false,
        socials: ['google', 'github', 'discord'],
    },
    siweConfig: siweConfig, // Teruskan siweConfig di sini.
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider basePath="/api/auth" >
                    {children}
                </SessionProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider