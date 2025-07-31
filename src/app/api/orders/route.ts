import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const userId = searchParams.get("user_id")
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_name,
          product_code,
          product_image_url,
          quantity,
          unit_price,
          total_price
        )
        `,
        { count: "exact" },
      ) // Select all columns including order_items
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by user ID (important for data isolation)
    if (userId) {
      query = query.eq("user_id", userId)
    }
    // Filter by status
    if (status && status !== "all") {
      query = query.eq("status", status)
    }
    // Search by order number or customer name
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`)
    }

    const { data: orders, error, count } = await query

    if (error) throw error

    // Memproses data pesanan untuk memastikan kolom numerik dikembalikan sebagai string
    // agar sesuai dengan format JSON yang Anda berikan.
    const processedOrders =
      orders?.map((order) => ({
        ...order,
        subtotal: String(order.subtotal),
        shipping_cost: String(order.shipping_cost),
        total_amount: String(order.total_amount),
      })) || []

    return NextResponse.json({
      success: true,
      orders: processedOrders, // Mengembalikan pesanan yang sudah diproses
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received order data:", body)
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_province,
      shipping_postal_code,
      shipping_city_id,
      shipping_province_id,
      items,
      courier,
      service,
      estimated_delivery,
      payment_method,
      subtotal,
      shipping_cost,
      total_amount,
    } = body

    // Validate required fields including user_id
    if (
      !user_id ||
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !shipping_address ||
      !shipping_city ||
      !shipping_province ||
      !shipping_postal_code ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate numeric fields
    if (typeof subtotal !== "number" || typeof shipping_cost !== "number" || typeof total_amount !== "number") {
      return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 })
    }

    // Generate order number (fallback if RPC doesn't exist)
    let orderNumber
    try {
      const { data: orderNumberData, error: orderNumberError } = await supabaseAdmin.rpc("generate_order_number")
      if (orderNumberError) throw orderNumberError
      orderNumber = orderNumberData
    } catch (rpcError) {
      // Fallback order number generation
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase()
      orderNumber = `ORD-${timestamp}-${randomStr}`
    }

    // Prepare order data with user_id
    const orderData = {
      user_id: user_id,
      order_number: orderNumber,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      customer_phone: customer_phone.trim(),
      shipping_address: shipping_address.trim(),
      shipping_city: shipping_city.trim(),
      shipping_province: shipping_province.trim(),
      shipping_postal_code: shipping_postal_code.trim(),
      shipping_city_id: shipping_city_id || null,
      shipping_province_id: shipping_province_id || null,
      subtotal: Number(subtotal),
      shipping_cost: Number(shipping_cost) || 0,
      total_amount: Number(total_amount),
      courier: courier || null,
      service: service || null,
      estimated_delivery: estimated_delivery || null,
      payment_method: payment_method || "midtrans",
      status: "pending",
      payment_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    console.log("Order data to insert:", orderData)

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert(orderData).select().single()
    if (orderError) {
      console.error("Order creation error:", orderError)
      throw orderError
    }

    // Helper function to generate deterministic UUID from string
    const generateDeterministicUUID = (input: string): string => {
      const crypto = require("crypto")
      const hash = crypto.createHash("md5").update(input).digest("hex")
      // Format as UUID v4
      return [
        hash.substr(0, 8),
        hash.substr(8, 4),
        "4" + hash.substr(12, 3),
        ((Number.parseInt(hash.substr(16, 1), 16) & 0x3) | 0x8).toString(16) + hash.substr(17, 3),
        hash.substr(20, 12),
      ].join("-")
    }

    // Create order items with proper UUID for product_id
    const orderItems = items.map((item: any) => {
      // Generate deterministic UUID based on item properties
      // This ensures same product always gets same UUID
      const productIdentifier = `${item.name}-${item.id || "unknown"}`
      const productId = generateDeterministicUUID(productIdentifier)
      return {
        order_id: order.id,
        product_id: productId,
        product_name: item.name,
        product_code: item.code || `PROD-${item.id}`,
        product_image_url: item.image,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        total_price: Number(item.price) * Number(item.quantity),
      }
    })
    console.log("Order items to insert:", orderItems)

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)
    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      // Try to delete the order if items creation failed
      await supabaseAdmin.from("orders").delete().eq("id", order.id)
      throw itemsError
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: orderNumber,
      message: "Order created successfully",
    })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
