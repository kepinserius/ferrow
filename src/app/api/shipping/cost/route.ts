import { type NextRequest, NextResponse } from "next/server"

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY
const RAJAONGKIR_BASE_URL = "https://api.rajaongkir.com/starter"

export async function POST(request: NextRequest) {
  try {
    if (!RAJAONGKIR_API_KEY) {
      return NextResponse.json({ error: "Raja Ongkir API key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { origin, destination, weight, courier } = body

    if (!origin || !destination || !weight || !courier) {
      return NextResponse.json({ error: "Origin, destination, weight, and courier are required" }, { status: 400 })
    }

    const formData = new FormData()
    formData.append("origin", origin.toString())
    formData.append("destination", destination.toString())
    formData.append("weight", weight.toString())
    formData.append("courier", courier)

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/cost`, {
      method: "POST",
      headers: {
        key: RAJAONGKIR_API_KEY,
      },
      body: formData,
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
      costs: data.rajaongkir.results,
    })
  } catch (error: any) {
    console.error("Error calculating shipping cost:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate shipping cost" }, { status: 500 })
  }
}
