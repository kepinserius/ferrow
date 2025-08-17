import { type NextRequest, NextResponse } from "next/server"
import { callRajaOngkir } from "@/lib/rajaongkir"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get("province")

    if (!provinceId) {
      return NextResponse.json(
        { success: false, error: "Province ID is required" },
        { status: 400 },
      )
    }

    const cities = await callRajaOngkir(`city?province=${provinceId}`)
    return NextResponse.json({ success: true, cities })
  } catch (error: any) {
    console.error("[Cities API] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch cities" },
      { status: 500 },
    )
  }
}
