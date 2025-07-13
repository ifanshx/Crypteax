// ifanshx/crypteax/Crypteax-7f72947c8ea77351e773bc6f0bfb818784a7600e/lib/auth.ts
import NextAuth from "next-auth";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import {
  type SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { prisma } from "@/lib/prisma"; //
import { UserRole as PrismaUserRole } from "@prisma/client";

// --- Deklarasi Tipe untuk NextAuth ---
declare module "next-auth" {
  interface Session extends SIWESession {
    user: {
      id: string;
      walletAddress: string;
      username?: string | null;
      image?: string | null;
      role: PrismaUserRole;
      points?: number;
      referralCode?: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    walletAddress: string;
    username?: string | null;
    image?: string | null;
    role: PrismaUserRole;
    points?: number;
    referralCode?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    walletAddress: string;
    username?: string | null;
    image?: string | null;
    role: PrismaUserRole;
    points?: number;
    referralCode?: string;
  }
}

// --- Validasi Environment Variables ---
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error(
    "NEXTAUTH_SECRET is not defined. Please set it in your .env file."
  );
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in your .env file."
  );
}

// --- Konfigurasi AuthOptions ---
export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    credentialsProvider({
      name: "Wallet",
      type: "credentials",
      credentials: {
        message: { label: "Message", type: "text", placeholder: "0x0" },
        signature: { label: "Signature", type: "text", placeholder: "0x0" },
        referralCode: {
          label: "Referral Code",
          type: "text",
          placeholder: "OPTIONAL",
          optional: true,
        },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials.signature) {
          console.error("Missing message or signature in credentials.");
          return null;
        }

        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        });

        if (!isValid) {
          console.error("Signature verification failed for address:", address);
          return null;
        }

        try {
          // 1. Coba cari user yang sudah ada berdasarkan wallet address
          let user = await prisma.user.findUnique({
            where: { address: address }, // Perubahan di sini
          });

          // 2. Jika user belum ada, buat user baru
          if (!user) {
            try {
              user = await prisma.user.create({
                data: {
                  username: `user_${Math.random() // Perubahan di sini
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase()}`,
                  role: PrismaUserRole.USER, // Perubahan di sini
                  address: address, // Perubahan di sini
                  points: 0, // Perubahan di sini
                  referralCode: Math.random() // Generate referral code unik
                    .toString(36)
                    .substring(2, 10)
                    .toUpperCase(),
                  isBlocked: false, // Perubahan di sini
                  // TODO: Anda mungkin ingin menambahkan logika untuk menggunakan referralCode
                  // yang diterima di `credentials` di sini, misalnya:
                  // referredById: referralCode ? await getUserIdFromReferralCode(referralCode) : null,
                },
              });
            } catch (createError) {
              // Tangani error jika terjadi konflik unique constraint saat pembuatan (race condition)
              if (
                createError instanceof Error &&
                "code" in createError &&
                createError.code === "P2002"
              ) {
                console.warn(
                  "Race condition: User already existed during creation attempt for address:",
                  address
                );
                // Coba ambil user lagi jika terjadi race condition
                user = await prisma.user.findUnique({
                  where: { address: address }, // Perubahan di sini
                });
                if (!user) {
                  // Jika masih tidak ditemukan (sangat jarang), log error dan return null
                  console.error(
                    "Failed to find user after P2002 race condition:",
                    address
                  );
                  return null;
                }
              } else {
                // Tangani error pembuatan lainnya
                console.error("Error creating user:", createError);
                return null;
              }
            }
          }

          // Pastikan user ada sebelum mengembalikan. Jika masih null (misalnya dari error di atas), return null.
          if (!user) {
            console.error("User object is null after authorization attempt.");
            return null;
          }

          // Mengembalikan objek User yang sesuai dengan deklarasi NextAuth
          return {
            id: user.id, // Perubahan di sini
            walletAddress: user.address, // Perubahan di sini
            username: user.username,
            image: user.image,
            role: user.role,
            points: user.points,
            referralCode: user.referralCode,
          };
        } catch (error) {
          // Tangani error umum yang mungkin terjadi selama proses authorize (selain P2002 yang sudah ditangani)
          console.error("Error during user authorization process:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.image = user.image;
        token.role = user.role;
        token.points = user.points;
        token.referralCode = user.referralCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.walletAddress = token.walletAddress as string;
        session.user.username = token.username as string | null;
        session.user.image = token.image as string | null;
        session.user.role = token.role as PrismaUserRole;
        session.user.points = token.points as number;
        session.user.referralCode = token.referralCode as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
