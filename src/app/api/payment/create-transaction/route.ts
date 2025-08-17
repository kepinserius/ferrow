import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY   // ✅ ditambahkan
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true"
const MIDTRANS_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions"

export async function POST(request: NextRequest) {
  try {
    if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {   // ✅ validasi keduanya
      return NextResponse.json({ error: "Midtrans server/client key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { order_id } = body

    console.log("Creating payment transaction for order:", order_id)

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          product_name,
          quantity,
          unit_price,
          total_price
        )
      `,
      )
      .eq("id", order_id)
      .single()

    if (orderError || !order) {
      console.error("Order not found:", orderError)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log("Order found:", order.order_number)

    // Prepare Midtrans transaction data
    const transactionData = {
      transaction_details: {
        order_id: order.order_number,
        gross_amount: Math.round(order.total_amount),
      },
      customer_details: {
        first_name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        shipping_address: {
          first_name: order.customer_name,
          address: order.shipping_address,
          city: order.shipping_city,
          postal_code: order.shipping_postal_code,
          country_code: "IDN",
        },
      },
      item_details: [
        ...order.order_items.map((item: any) => ({
          id: item.product_name.replace(/\s+/g, "-").toLowerCase(),
          price: Math.round(item.unit_price),
          quantity: item.quantity,
          name: item.product_name,
        })),
        ...(order.shipping_cost > 0
          ? [
              {
                id: "shipping-cost",
                price: Math.round(order.shipping_cost),
                quantity: 1,
                name: "Shipping Cost",
              },
            ]
          : []),
      ],
      enabled_payments: ["credit_card", "bca_va", "bni_va", "bri_va", "echannel", "gopay", "shopeepay"],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/finish`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/pending`,
      },
    }

    console.log("Transaction data:", JSON.stringify(transactionData, null, 2))

    // Create transaction with Midtrans using Snap API
    const response = await fetch(MIDTRANS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(transactionData),
    })

    console.log("Midtrans response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Midtrans API Error:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (parseError) {
        throw new Error(`Midtrans API error: ${response.status} ${response.statusText}`)
      }

      throw new Error(errorData.error_messages?.[0] || errorData.message || "Failed to create transaction")
    }

    const result = await response.json()
    console.log("Midtrans success response:", result)

    // Update order with payment token and URL
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_token: result.token,
        payment_url: result.redirect_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)

    if (updateError) {
      console.error("Failed to update order:", updateError)
      throw updateError
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      redirect_url: result.redirect_url,
      client_key: MIDTRANS_CLIENT_KEY,   // ✅ dikembalikan supaya frontend bisa pakai Snap.js
      message: "Payment transaction created successfully",
    })
  } catch (error: any) {
    console.error("Error creating payment transaction:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment transaction" }, { status: 500 })
  }
}
