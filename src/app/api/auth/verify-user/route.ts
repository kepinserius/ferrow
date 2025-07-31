import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 })
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, phone, email_verified") // Select email_verified
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Supabase error fetching user for verification:", error)
      throw error
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 })
    }

    // Return user data including email_verified status
    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("Error verifying user:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to verify user." }, { status: 500 })
  }
}
