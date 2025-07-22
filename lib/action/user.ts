// lib/actions/user.ts

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; //
import { UserRole } from "@prisma/client"; // Impor UserRole dari Prisma client untuk type safety

/**
 * Zod schemas untuk validasi input.
 * Memastikan data yang diterima valid sebelum diproses.
 */
const UsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .max(30, "Username maksimal 30 karakter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, underscore."),
});

const ImageUrlSchema = z.object({
  // Menerima string jalur relatif atau URL lengkap.
  // Validasi dasar untuk memastikan string tidak kosong.
  imageUrl: z.string().min(1, "URL gambar tidak boleh kosong."),
});

/**
 * Fungsi pembantu untuk mendapatkan sesi user yang terautentikasi.
 * Melemparkan error jika user tidak terautentikasi.
 *
 * @returns Promise<Session["user"]> Data user dari sesi.
 * @throws Error "UNAUTHORIZED" jika tidak ada sesi atau user.
 */
async function getAuthUser() {
  const session = await getServerSession(authOptions); //
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }
  // Pastikan user.role memiliki tipe yang benar dari Prisma
  return session.user as typeof session.user & { role: UserRole };
}

/**
 * Memperbarui username untuk user yang sedang login.
 *
 * @param formData FormData yang berisi 'username' baru.
 * @returns Promise<{ success: boolean; message: string; user?: any }> Hasil operasi.
 */
export async function updateUsername(formData: FormData) {
  try {
    const userSession = await getAuthUser(); // Memastikan user terautentikasi.
    const payload = UsernameSchema.parse({
      username: formData.get("username") as string,
    });

    // Cek apakah username sudah digunakan oleh user lain.
    const exists = await prisma.user.findUnique({
      where: { username: payload.username }, //
    });
    if (exists && exists.id !== userSession.id) {
      return { success: false, message: "Username sudah digunakan." };
    }

    // Melakukan update di database.
    const updated = await prisma.user.update({
      where: { id: userSession.id }, //
      data: { username: payload.username }, //
    });

    return { success: true, user: updated, message: "Username diperbarui." };
  } catch (err) {
    // Menangani error validasi Zod atau error lainnya.
    if (err instanceof z.ZodError) {
      return { success: false, message: err.errors[0].message };
    }
    console.error("Error updating username:", err); // Logging error untuk debugging.
    return { success: false, message: "Gagal memperbarui username." };
  }
}

/**
 * Memperbarui foto profil user.
 *
 * @param formData FormData yang berisi 'imageUrl' baru.
 * @returns Promise<{ success: boolean; message: string; user?: any }> Hasil operasi.
 */
export async function updateProfileImage(formData: FormData) {
  try {
    const userSession = await getAuthUser();
    const payload = ImageUrlSchema.parse({
      imageUrl: formData.get("imageUrl") as string,
    });

    const updated = await prisma.user.update({
      where: { id: userSession.id }, //
      data: { image: payload.imageUrl }, //
    });

    return { success: true, user: updated, message: "Foto profil diperbarui." };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, message: err.errors[0].message };
    }
    console.error("Error updating profile image:", err);
    return { success: false, message: "Gagal memperbarui foto profil." };
  }
}

/**
 * Mengambil data profil user berdasarkan alamat wallet.
 *
 * @param walletAddress Alamat wallet user yang dicari.
 * @returns Promise<User | null> Objek user atau null jika tidak ditemukan.
 */
export async function getUserProfile(walletAddress: string) {
  try {
    return await prisma.user.findUnique({
      where: { address: walletAddress }, //
      select: {
        id: true, //
        username: true, //
        image: true, //
        role: true, //
        address: true, //
        isBlocked: true, //
        referralCode: true, //
        points: true, //
        // rewardWalletAddress: true, // Dihapus karena tidak ada di skema Prisma User
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

/**
 * Mengubah status blokir user (hanya untuk Admin).
 *
 * @param userId ID user yang akan diubah status blokirnya.
 * @returns Promise<{ success: boolean; message: string; user?: any }> Hasil operasi.
 */
export async function toggleBlockUser(userId: string) {
  try {
    const userSession = await getAuthUser();
    // Memastikan hanya ADMIN yang bisa menjalankan aksi ini.
    if (userSession.role !== "ADMIN") {
      //
      return {
        success: false,
        message: "Forbidden: Anda tidak memiliki izin admin.",
      };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } }); //
    if (!user) {
      return { success: false, message: "User tidak ditemukan." };
    }

    const updated = await prisma.user.update({
      where: { id: userId }, //
      data: { isBlocked: !user.isBlocked }, //
    });

    return {
      success: true,
      user: updated,
      message: updated.isBlocked
        ? "User berhasil diblokir."
        : "User berhasil dibuka blokirnya.",
    };
  } catch (err) {
    console.error("Error toggling user block status:", err);
    return { success: false, message: "Gagal mengubah status blokir user." };
  }
}
