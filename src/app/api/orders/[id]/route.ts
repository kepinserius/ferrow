import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_code,
          product_image_url,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, payment_status, tracking_number, notes } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (tracking_number) updateData.tracking_number = tracking_number
    if (notes !== undefined) updateData.notes = notes

    // Set paid_at when payment status changes to paid
    if (payment_status === "paid") {
      updateData.paid_at = new Date().toISOString()
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      order,
      message: "Order updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: error.message || "Failed to delete order" }, { status: 500 })
  }
}
