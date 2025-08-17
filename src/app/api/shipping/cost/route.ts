import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, weight, courier } = await request.json()

    if (!origin || !destination || !weight) {
      return NextResponse.json(
        { success: false, error: "Origin, destination, and weight are required" },
        { status: 400 },
      )
    }

    const couriers = courier ? [courier] : ["jne", "tiki", "pos"]
    const results: any[] = []

    for (const courierCode of couriers) {
      const response = await fetch("https://api.rajaongkir.com/starter/cost", {
        method: "POST",
        headers: {
          key: process.env.RAJAONGKIR_API_KEY!,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          origin: origin.toString(),
          destination: destination.toString(),
          weight: weight.toString(),
          courier: courierCode,
        }),
      })

      if (!response.ok) continue
      const data = await response.json()

      if (data.rajaongkir.status.code === 200 && data.rajaongkir.results.length > 0) {
        const courierData = data.rajaongkir.results[0]
        courierData.costs.forEach((cost: any) => {
          results.push({
            courier: courierData.name.toUpperCase(),
            courierCode: courierData.code,
            service: cost.service,
            cost: cost.cost[0].value,
            estimatedDelivery: cost.cost[0].etd + " hari",
            description: cost.description,
          })
        })
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: "No shipping options available" },
        { status: 404 },
      )
    }

    results.sort((a, b) => a.cost - b.cost)

    return NextResponse.json({ success: true, shippingOptions: results })
  } catch (error: any) {
    console.error("[Cost API] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate shipping cost" },
      { status: 500 },
    )
  }
}
