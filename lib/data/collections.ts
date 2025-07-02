// lib/data/collections.ts

// Definisikan interface untuk koleksi sesuai dengan data dummy yang paling lengkap
export interface Collection {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  imageUrl: string; // Ini akan menjadi thumbnail untuk carousel, dan logo di detail page
  status: "Live" | "Coming Soon" | "Ended";
  mintPrice?: string; // Opsional
  currentSupply?: number; // Opsional
  maxSupply?: number; // Opsional
  mintCurrency?: string; // Opsional
  contractAddress?: string; // Opsional
  externalUrl?: string; // OpenseaLink
  twitterUrl?: string; // Opsional
  discordUrl?: string; // Opsional
}

// Data dummy koleksi tunggal
export const dummyCollections: Collection[] = [
  {
    id: "herbivores-collection-id",
    name: "Herbivores",
    description:
      "Koleksi NFT Herbivores adalah koleksi unik dari makhluk-makhluk digital yang hidup di ekosistem blockchain. Setiap Herbivore memiliki karakteristik dan kelangkaan yang berbeda.",
    bannerUrl: "/assets/banners/banner-herbivores.png",
    imageUrl: "/assets/banners/banner-herbivores.png", // Logo untuk detail page, thumbnail untuk carousel
    status: "Live",
    mintPrice: "0.1 TEA",
    currentSupply: 1234,
    maxSupply: 10000,
    mintCurrency: "TEA",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    externalUrl: "https://opensea.io/collection/herbivores-example", // Ini OpenseaLink
    twitterUrl: "https://twitter.com/herbivores",
    discordUrl: "https://discord.gg/herbivores",
  },
  {
    id: "upri-world-collection-id",
    name: "Upri World",
    description:
      "Upri World adalah koleksi NFT yang berfokus pada pembangunan dunia virtual yang inklusif dan imersif. Jelajahi karakter unik dan properti digital.",
    bannerUrl: "/assets/banners/banner-upri-world.png",
    imageUrl: "/assets/banners/banner-upri-world.png", // Thumbnail/logo untuk detail page
    status: "Ended",
    mintPrice: "1 TEA",
    currentSupply: 5000,
    maxSupply: 5000,
    mintCurrency: "TEA",
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    externalUrl: "https://opensea.io/collection/upri-world",
    twitterUrl: "https://twitter.com/upriworld",
    discordUrl: "https://discord.gg/upriworld",
  },
  {
    id: "seals-collection-id",
    name: "Seals",
    description:
      "This is a placeholder for an upcoming collection that will be launched soon. Stay tuned for more details!",
    bannerUrl: "/assets/banners/banner-seals.png",
    imageUrl: "/assets/banners/banner-seals.png",
    status: "Coming Soon",
    mintPrice: "0.05 TEA",
    currentSupply: 0,
    maxSupply: 10000,
    mintCurrency: "TEA",
    contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    externalUrl: "https://opensea.io/collection/seals-example",
    twitterUrl: "https://twitter.com/sealscollection",
    discordUrl: "https://discord.gg/sealscollection",
  },
];

// Fungsi untuk mengambil data koleksi (digunakan di MintPage)
export function getCollectionById(id: string): Collection | undefined {
  return dummyCollections.find((col) => col.id === id);
}

// Fungsi untuk mengambil semua koleksi (digunakan di HomePage)
export function getAllCollections(): Collection[] {
  return dummyCollections;
}
