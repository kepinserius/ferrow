import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// GET all products
export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in GET /api/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CREATE new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || body.stock === undefined) {
      return NextResponse.json({ error: "Missing required fields: name, price, stock" }, { status: 400 })
    }

    const { data, error } = await supabase.from("products").insert([body]).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
