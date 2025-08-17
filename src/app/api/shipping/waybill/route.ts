import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Raja Ongkir API key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { waybill, courier } = body

    // Validasi input
    if (!waybill || !courier) {
      return NextResponse.json({ error: "Missing required parameters: waybill, courier" }, { status: 400 })
    }

    // Buat form data untuk POST request
    const formData = new FormData()
    formData.append("waybill", waybill)
    formData.append("courier", courier)

    const response = await fetch("https://api.rajaongkir.com/starter/waybill", {
      method: "POST",
      headers: {
        key: apiKey,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.rajaongkir?.status?.description || "Failed to track waybill")
    }

    return NextResponse.json({
      success: true,
      data: data.rajaongkir.result,
    })
  } catch (error) {
    console.error("Error tracking waybill:", error)
    return NextResponse.json({ error: "Failed to track waybill" }, { status: 500 })
  }
}
