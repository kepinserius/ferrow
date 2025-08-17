import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.KOMMERCE_API_KEY
    if (!apiKey) {
      console.log("[v0] KOMMERCE_API_KEY not configured")
      return NextResponse.json({ error: "KOMMERCE_API_KEY not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching provinces from Kommerce API...")
    const response = await fetch("https://api.kommerce.id/shipping/domestic-destination", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.log("[v0] Kommerce API error:", response.status)
      throw new Error(`Kommerce API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Kommerce destinations response:", data)

    // Extract unique provinces from destinations
    const provinces =
      data.destinations?.reduce((acc: any[], dest: any) => {
        const existing = acc.find((p) => p.province_id === dest.province_id)
        if (!existing) {
          acc.push({
            province_id: dest.province_id,
            province: dest.province,
          })
        }
        return acc
      }, []) || []

    console.log("[v0] Extracted provinces:", provinces.length)
    return NextResponse.json({ success: true, provinces })
  } catch (error: any) {
    console.error("[v0] Kommerce Provinces API Error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch provinces" }, { status: 500 })
  }
}
