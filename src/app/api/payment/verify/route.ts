import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true"
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2"

export async function POST(request: NextRequest) {
  try {
    if (!MIDTRANS_SERVER_KEY) {
      return NextResponse.json({ error: "Midtrans server key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { order_id, transaction_status, transaction_id } = body

    console.log("[v0] Verifying payment:", { order_id, transaction_status, transaction_id })

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", order_id)
      .single()

    if (orderError || !order) {
      console.error("[v0] Order not found:", orderError)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    let midtransStatus = null
    if (transaction_id) {
      try {
        const statusResponse = await fetch(`${MIDTRANS_API_URL}/${transaction_id}/status`, {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
        })

        if (statusResponse.ok) {
          midtransStatus = await statusResponse.json()
          console.log("[v0] Midtrans status response:", midtransStatus)
        }
      } catch (error) {
        console.error("[v0] Error fetching Midtrans status:", error)
      }
    }

    let finalStatus = transaction_status || "pending"
    let shouldUpdateOrder = false

    if (midtransStatus) {
      finalStatus = midtransStatus.transaction_status
      shouldUpdateOrder = true
    } else if (transaction_status) {
      finalStatus = transaction_status
      shouldUpdateOrder = true
    }

    if (shouldUpdateOrder && order.payment_status !== finalStatus) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: finalStatus,
          transaction_id: transaction_id || midtransStatus?.transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (updateError) {
        console.error("[v0] Failed to update order status:", updateError)
      } else {
        console.log("[v0] Order status updated to:", finalStatus)
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.order_number,
        total_amount: order.total_amount,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        payment_status: finalStatus,
        transaction_id: transaction_id || midtransStatus?.transaction_id || order.transaction_id,
        payment_method: order.payment_method,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error verifying payment:", error)
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 })
  }
}
