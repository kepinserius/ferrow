import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, weight, courier } = body

    // Validate required fields
    if (!origin || !destination || !weight) {
      return NextResponse.json(
        { success: false, error: "Origin, destination, and weight are required" },
        { status: 400 },
      )
    }

    // Default couriers if not specified
    const couriers = courier ? [courier] : ["jne", "tiki", "pos"]
    const results: { courier: any; courierCode: any; service: any; cost: any; estimatedDelivery: string; description: any }[] = []

    // Fetch cost for each courier
    for (const courierCode of couriers) {
      try {
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

        if (!response.ok) {
          console.error(`Error fetching cost for ${courierCode}:`, response.status)
          continue
        }

        const data = await response.json()

        if (data.rajaongkir.status.code === 200 && data.rajaongkir.results.length > 0) {
          const courierData = data.rajaongkir.results[0]

          // Process each service for this courier
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
      } catch (courierError) {
        console.error(`Error processing courier ${courierCode}:`, courierError)
        continue
      }
    }

    if (results.length === 0) {
      return NextResponse.json({ success: false, error: "No shipping options available" }, { status: 404 })
    }

    // Sort by cost (cheapest first)
    results.sort((a, b) => a.cost - b.cost)

    return NextResponse.json({
      success: true,
      shippingOptions: results,
    })
  } catch (error: any) {
    console.error("Error calculating shipping cost:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to calculate shipping cost",
      },
      { status: 500 },
    )
  }
}
