import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import crypto from "crypto"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY

export async function POST(request: NextRequest) {
  try {
    if (!MIDTRANS_SERVER_KEY) {
      console.error("Midtrans server key not configured")
      return NextResponse.json({ error: "Midtrans server key not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("Received Midtrans notification:", body)

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body

    // Verify signature
    const serverKey = MIDTRANS_SERVER_KEY
    const input = order_id + status_code + gross_amount + serverKey
    const hash = crypto.createHash("sha512").update(input).digest("hex")

    if (hash !== signature_key) {
      console.error("Invalid signature:", { expected: hash, received: signature_key })
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("Signature verified successfully")

    // Determine payment status
    let paymentStatus = "pending"
    let orderStatus = "pending"

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        paymentStatus = "pending"
      } else if (fraud_status === "accept") {
        paymentStatus = "paid"
        orderStatus = "confirmed"
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "paid"
      orderStatus = "confirmed"
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      paymentStatus = "failed"
      orderStatus = "cancelled"
    } else if (transaction_status === "pending") {
      paymentStatus = "pending"
    }

    console.log("Payment status determined:", { paymentStatus, orderStatus, transaction_status, fraud_status })

    // Update order status
    const updateData: any = {
      payment_status: paymentStatus,
      status: orderStatus,
      updated_at: new Date().toISOString(),
    }

    if (paymentStatus === "paid") {
      updateData.paid_at = new Date().toISOString()
    }

    const { data: updatedOrder, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("order_number", order_id)
      .select()
      .single()

    if (error) {
      console.error("Failed to update order:", error)
      throw error
    }

    console.log("Order updated successfully:", updatedOrder)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error processing payment notification:", error)
    return NextResponse.json({ error: error.message || "Failed to process notification" }, { status: 500 })
  }
}
