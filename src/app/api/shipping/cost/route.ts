import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origin, destination, weight, courier } = body

    if (!origin || !destination || !weight) {
      return NextResponse.json(
        {
          error: "origin, destination, and weight are required",
        },
        { status: 400 },
      )
    }

    const apiKey = process.env.KOMMERCE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "KOMMERCE_API_KEY not configured" }, { status: 500 })
    }

    console.log("[v0] Calculating shipping cost:", { origin, destination, weight, courier })

    // Use Kommerce shipping cost calculation endpoint
    const response = await fetch("https://api.kommerce.id/shipping/domestic-cost", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: origin,
        destination: destination,
        weight: weight,
        courier: courier || "jne,tiki,pos", // Default to multiple couriers
      }),
    })

    if (!response.ok) {
      throw new Error(`Kommerce API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Shipping cost response:", data)

    return NextResponse.json({ success: true, results: data })
  } catch (error: any) {
    console.error("[v0] Kommerce Cost API Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate shipping cost" },
      { status: 500 },
    )
  }
}
