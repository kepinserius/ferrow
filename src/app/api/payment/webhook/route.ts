import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import crypto from "crypto"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY

export async function POST(request: NextRequest) {
  try {
    if (!MIDTRANS_SERVER_KEY) {
      return NextResponse.json({ error: "Midtrans server key not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("[v0] Webhook received:", body)

    const { order_id, transaction_status, transaction_id, signature_key, gross_amount, payment_type, fraud_status } =
      body

    const serverKey = MIDTRANS_SERVER_KEY
    const input = `${order_id}${transaction_status}${gross_amount}${serverKey}`
    const hash = crypto.createHash("sha512").update(input).digest("hex")

    if (hash !== signature_key) {
      console.error("[v0] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", order_id)
      .single()

    if (orderError || !order) {
      console.error("[v0] Order not found for webhook:", orderError)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    let orderStatus = "pending"
    let paymentStatus = transaction_status

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) {
        orderStatus = "paid"
        paymentStatus = "success"
      }
    } else if (transaction_status === "pending") {
      orderStatus = "pending"
      paymentStatus = "pending"
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      orderStatus = "cancelled"
      paymentStatus = "failed"
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        transaction_id: transaction_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    if (updateError) {
      console.error("[v0] Failed to update order via webhook:", updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    console.log("[v0] Order updated via webhook:", {
      order_id,
      orderStatus,
      paymentStatus,
      transaction_id,
    })

    // You can add email sending logic here

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 })
  }
}
