import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// GET single product
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params Promise
    const { id } = await params

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params Promise
    const { id } = await params
    
    const body = await request.json()

    const { data, error } = await supabase.from("products").update(body).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params Promise
    const { id } = await params

    // First check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", id)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete the product
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting product:", deleteError)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedProduct: existingProduct,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}