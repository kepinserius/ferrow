import { NextResponse } from "next/server"
import { callRajaOngkir } from "@/lib/rajaongkir"

export async function GET() {
  try {
    const provinces = await callRajaOngkir("province")
    return NextResponse.json({ success: true, provinces })
  } catch (error: any) {
    console.error("[Provinces API] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch provinces" },
      { status: 500 },
    )
  }
}
