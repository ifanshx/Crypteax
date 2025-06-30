// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Pastikan path ini benar sesuai lokasi file authOptions Anda

// Membuat handler NextAuth dengan konfigurasi yang diimpor
const handler = NextAuth(authOptions);

// Mengekspor handler untuk metode GET dan POST
export { handler as GET, handler as POST };
