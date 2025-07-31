import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

// Definisi Interface untuk OrderItem
interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_code: string
  product_image_url?: string | null
  quantity: number
  unit_price: number // Dari DB, ini adalah number
  total_price: number // Dari DB, ini adalah number
  created_at: string
}

// Definisi Interface untuk Order
interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_province: string
  shipping_postal_code: string
  shipping_city_id?: string | null
  shipping_province_id?: string | null
  subtotal: number // Dari DB, ini adalah number
  shipping_cost: number // Dari DB, ini adalah number
  total_amount: number // Dari DB, ini adalah number
  courier?: string | null
  service?: string | null
  estimated_delivery?: string | null
  tracking_number?: string | null
  payment_method?: string | null
  payment_status: string
  payment_token?: string | null
  payment_url?: string | null
  paid_at?: string | null
  status: string
  notes?: string | null
  created_at: string
  updated_at: string
  user_id?: string | null
  order_items: OrderItem[] // Menambahkan array order_items
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Mengambil data order dan order_items terkait
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          order_id,
          product_id,
          product_name,
          product_code,
          product_image_url,
          quantity,
          unit_price,
          total_price,
          created_at
        )
      `,
      )
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Supabase error fetching order:", error)
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Menggunakan type assertion untuk 'data' agar TypeScript memahami strukturnya
    const order: Order = data as Order

    // Memproses data order untuk memastikan kolom numerik dikembalikan sebagai string
    const processedOrder = {
      ...order,
      subtotal: String(order.subtotal),
      shipping_cost: String(order.shipping_cost),
      total_amount: String(order.total_amount),
      order_items: order.order_items.map((item) => ({
        ...item,
        unit_price: String(item.unit_price),
        total_price: String(item.total_price),
      })),
    }

    return NextResponse.json({
      success: true,
      order: processedOrder,
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
