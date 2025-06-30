// config/siweConfig.ts
import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from "@reown/appkit-siwe";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { mainnet, sepolia } from "@reown/appkit/networks"; // mainnet, arbitrum diganti dengan mainnet, sepolia karena sudah ada di context/index.tsx

export const siweConfig = createSIWEConfig({
  // Dapatkan parameter pesan untuk SIWE.
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "", // Domain aplikasi.
    uri: typeof window !== "undefined" ? window.location.origin : "", // URI aplikasi.
    chains: [mainnet.id, sepolia.id], // Chain IDs yang didukung.
    statement: "Please sign with your account", // Pernyataan yang akan ditampilkan kepada pengguna.
  }),
  // Buat pesan SIWE.
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  // Dapatkan nonce untuk mencegah serangan replay.
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!"); // Lemparkan error jika nonce tidak ditemukan.
    }
    return nonce;
  },
  // Dapatkan sesi pengguna.
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      return null;
    }
    // Validasi tipe address dan chainId.
    if (
      typeof session.address !== "string" ||
      typeof session.chainId !== "number"
    ) {
      return null;
    }
    return {
      address: session.address,
      chainId: session.chainId,
    } satisfies SIWESession;
  },
  // Verifikasi tanda tangan pesan SIWE.
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/protected", // URL callback setelah berhasil.
      });
      return Boolean(success?.ok); // Kembalikan true jika verifikasi berhasil.
    } catch (error) {
      console.error("Authentication error:", error); // Log error untuk debugging
      return false; // Kembalikan false jika ada error.
    }
  },
  // Lakukan sign out pengguna.
  signOut: async () => {
    try {
      await signOut({
        redirect: false,
      });
      return true; // Kembalikan true jika sign out berhasil.
    } catch (error) {
      console.error("Authentication error:", error); // Log error untuk debugging
      return false; // Kembalikan false jika ada error.
    }
  },
});
