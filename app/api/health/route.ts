// src/app/api/health/route.ts
import { NextResponse } from "next/server";

/**
 * @summary Endpoint Health Check.
 * @description Mengembalikan status OK untuk menunjukkan bahwa API sedang berjalan.
 * Digunakan untuk pemantauan sistem.
 * @returns Respon JSON dengan status dan timestamp.
 */
export async function GET() {
  return NextResponse.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
}
