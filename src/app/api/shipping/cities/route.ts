import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get("province_id")

    if (!provinceId) {
      return NextResponse.json({ success: false, error: "Province ID is required" }, { status: 400 })
    }

    const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
      method: "GET",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    })

    if (!response.ok) {
      throw new Error(`Raja Ongkir API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.rajaongkir.status.code !== 200) {
      throw new Error(data.rajaongkir.status.description)
    }

    return NextResponse.json({
      success: true,
      cities: data.rajaongkir.results,
    })
  } catch (error: any) {
    console.error("Error fetching cities:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch cities",
      },
      { status: 500 },
    )
  }
}
