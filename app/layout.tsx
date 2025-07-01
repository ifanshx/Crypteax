import type { Metadata } from "next";


import { headers } from 'next/headers' // added
import './globals.css';
import ContextProvider from '@/context'
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Cryptea",
  description: "Stake, Win, and LFG CRYPTEA!",
  keywords: ['chain development toolkits such as Arbitrum Orbit',
    'Foundry, Viem, Hardhat, and Ether.', 'TypeScript, Next.js, and React',
    'Layer 2 solutions, wallets, and ERC standards ( ERC-20, ERC- 721)',
    'Web3 technologies (EVM, Solidity, ethers.js/web3.js)', 'real-time systems (WebSockets, WebRTC)'],
  openGraph: {
    type: "website",
    url: "https://cryptea-vert.vercel.app",
    title: "Cryptea",
    description: "Stake, Win, and LFG CRYPTEA!",
    images: [
      {
        url: "https://cryptea-vert.vercel.app/assets/general/cryptea.png",
        width: 1200,
        height: 630,
        alt: "Cryptea Share Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cryptea",
    description: "Stake, Win, and LFG CRYPTEA!",
    images: ["https://cryptea-vert.vercel.app/assets/general/cryptea.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}