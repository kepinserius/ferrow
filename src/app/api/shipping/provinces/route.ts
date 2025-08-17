import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Provinces API called")
    console.log("[v0] RAJAONGKIR_API_KEY exists:", !!process.env.RAJAONGKIR_API_KEY)

    if (!process.env.RAJAONGKIR_API_KEY) {
      console.error("[v0] RAJAONGKIR_API_KEY is not configured")
      return NextResponse.json(
        {
          success: false,
          error: "RAJAONGKIR_API_KEY is not configured",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Making request to Raja Ongkir API...")
    const response = await fetch("https://api.rajaongkir.com/starter/province", {
      method: "GET",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    })

    console.log("[v0] Raja Ongkir response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Raja Ongkir API error response:", errorText)
      throw new Error(`Raja Ongkir API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Raja Ongkir response data:", JSON.stringify(data, null, 2))

    if (data.rajaongkir.status.code !== 200) {
      console.error("[v0] Raja Ongkir API status error:", data.rajaongkir.status)
      throw new Error(data.rajaongkir.status.description)
    }

    console.log("[v0] Successfully fetched", data.rajaongkir.results.length, "provinces")
    return NextResponse.json({
      success: true,
      provinces: data.rajaongkir.results,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching provinces:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch provinces",
      },
      { status: 500 },
    )
  }
}
