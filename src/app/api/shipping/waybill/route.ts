import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "RAJAONGKIR_API_KEY is not configured" }, { status: 500 })
    }

    const { waybill, courier } = await request.json()
    if (!waybill || !courier) {
      return NextResponse.json(
        { error: "Missing required parameters: waybill, courier" },
        { status: 400 },
      )
    }

    const formData = new FormData()
    formData.append("waybill", waybill)
    formData.append("courier", courier)

    const response = await fetch("https://api.rajaongkir.com/starter/waybill", {
      method: "POST",
      headers: { key: apiKey },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok || data.rajaongkir.status.code !== 200) {
      throw new Error(data.rajaongkir?.status?.description || "Failed to track waybill")
    }

    return NextResponse.json({ success: true, data: data.rajaongkir.result })
  } catch (error: any) {
    console.error("[Waybill API] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to track waybill" },
      { status: 500 },
    )
  }
}
