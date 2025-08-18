import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.KOMMERCE_API_KEY
    if (!apiKey) {
      console.log("[v0] KOMMERCE_API_KEY not configured")
      return NextResponse.json({ error: "KOMMERCE_API_KEY not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching provinces from Kommerce RajaOngkir API...")

    const response = await fetch("https://rajaongkir.komerce.id/api/v1/destination/province", {
      method: "GET",
      headers: {
        Key: apiKey,
      },
    })

    const rawText = await response.text()
    console.log("[v0] Raw response body:", rawText)

    if (!response.ok) {
      throw new Error(`Kommerce API error: ${response.status} - ${rawText}`)
    }

    const data = JSON.parse(rawText)

    if (!data.data) {
      console.error("[v0] 'data' field tidak ditemukan di response.")
      return NextResponse.json({ success: false, error: "Field 'data' tidak ada di response" }, { status: 500 })
    }

    const provinces = data.data.map((p: any) => ({
      province_id: p.id,
      province: p.name,
    }))

    console.log("[v0] Extracted provinces:", provinces.length)
    return NextResponse.json({ success: true, provinces })
  } catch (error: any) {
    console.error("[v0] Kommerce Provinces API Error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch provinces" }, { status: 500 })
  }
}
