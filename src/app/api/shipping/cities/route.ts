import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get("province_id")

    if (!provinceId) {
      return NextResponse.json({ error: "province_id is required" }, { status: 400 })
    }

    const apiKey = process.env.KOMMERCE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "KOMMERCE_API_KEY not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching cities for province:", provinceId)
    // const response = await fetch("https://api.kommerce.id/shipping/domestic-destination", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    // })
    const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`, {
      method: "GET",
      headers: {
        Key: `${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Kommerce API error: ${response.status}`)
    }

    const data = await response.json()

    console.log(data)

    // Filter cities by province_id
    // const cities =
    //   data.destinations
    //     ?.filter((dest: any) => dest.province_id.toString() === provinceId.toString())
    //     .map((dest: any) => ({
    //       city_id: dest.city_id,
    //       city_name: dest.city_name,
    //       type: dest.type,
    //       postal_code: dest.postal_code,
    //     })) || []

    const cities =
      data.data.map((city: any) => ({
          city_id: city.id,
          city_name: city.name
        })) || []

    console.log("[v0] Found cities:", cities.length)
    return NextResponse.json({ success: true, cities })
  } catch (error: any) {
    console.error("[v0] Kommerce Cities API Error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch cities" }, { status: 500 })
  }
}
