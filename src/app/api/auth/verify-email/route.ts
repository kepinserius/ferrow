import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/user/login-user?error=invalid_token", request.url))
    }

    // Find user with this verification token
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single()

    if (fetchError || !user) {
      console.error("Error finding user with token:", fetchError)
      return NextResponse.redirect(new URL("/user/login-user?error=invalid_token", request.url))
    }

    if (user.email_verified) {
      // Already verified, redirect to success page
      return NextResponse.redirect(new URL("/user/login-user?success=already_verified", request.url))
    }

    // Update user as verified
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        email_verified: true,
        verification_token: null, // Clear the token
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating user verification:", updateError)
      return NextResponse.redirect(new URL("/user/login-user?error=verification_failed", request.url))
    }

    // Redirect to success page
    return NextResponse.redirect(new URL("/user/login-user?success=verified", request.url))
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(new URL("/user/login-user?error=server_error", request.url))
  }
}
