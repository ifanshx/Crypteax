// next-auth.d.ts
import { DefaultSession } from "next-auth";
import { SIWESession } from "@reown/appkit-siwe"; // Import SIWESession dari appkit-siwe

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession, SIWESession {
    address: string;
    chainId: number;
    // Anda bisa menambahkan properti kustom lain di sini jika diperlukan
  }
}

// Anda mungkin juga perlu memperbarui antarmuka JWT jika Anda menggunakan strategi JWT
declare module "next-auth/jwt" {
  interface JWT extends SIWESession {
    address: string;
    chainId: number;
  }
}
