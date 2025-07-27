import { NextResponse } from "next/server"

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY
const RAJAONGKIR_BASE_URL = "https://api.rajaongkir.com/starter"

export async function GET() {
  try {
    if (!RAJAONGKIR_API_KEY) {
      return NextResponse.json({ error: "Raja Ongkir API key not configured" }, { status: 500 })
    }

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/province`, {
      method: "GET",
      headers: {
        key: RAJAONGKIR_API_KEY,
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
    return NextResponse.json({ error: error.message || "Failed to fetch provinces" }, { status: 500 })
  }
}
