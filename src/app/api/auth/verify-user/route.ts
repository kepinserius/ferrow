import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, phone, email_verified")
      .eq("id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("User verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify user" }, { status: 500 })
  }
}
