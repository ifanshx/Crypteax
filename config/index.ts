import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const TeaSepolia = defineChain({
  id: 10218,
  caipNetworkId: "eip155:10218",
  chainNamespace: "eip155",
  name: "Tea Sepolia Testnet",
  nativeCurrency: { name: "Tea Sepolia Testnet", symbol: "TEA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://tea-sepolia.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: { name: "Tea Sepolia Testnet", url: "https://sepolia.tea.xyz" },
  },
  contracts: {
    // Add the contracts here
  },
});

export const networks = [TeaSepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
