import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.rajaongkir.com/starter/province", {
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
      provinces: data.rajaongkir.results,
    })
  } catch (error: any) {
    console.error("Error fetching provinces:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch provinces",
      },
      { status: 500 },
    )
  }
}
