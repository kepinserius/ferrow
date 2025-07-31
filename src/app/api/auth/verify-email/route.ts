import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/auth/verification-failed?reason=no_token", request.url))
    }

    // Cari pengguna dengan token verifikasi ini
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, email_verified")
      .eq("verification_token", token)
      .single()

    if (fetchError || !user) {
      console.error("Error finding user with token:", fetchError)
      return NextResponse.redirect(new URL("/auth/verification-failed?reason=invalid_token", request.url))
    }

    if (user.email_verified) {
      // Sudah diverifikasi sebelumnya
      return NextResponse.redirect(new URL("/auth/verification-success?status=already_verified", request.url))
    }

    // Perbarui status email_verified dan hapus token verifikasi
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ email_verified: true, verification_token: null, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating user verification status:", updateError)
      return NextResponse.redirect(new URL("/auth/verification-failed?reason=update_failed", request.url))
    }

    // Redirect ke halaman sukses
    return NextResponse.redirect(new URL("/auth/verification-success", request.url))
  } catch (error: any) {
    console.error("Verify Email API Error:", error)
    return NextResponse.redirect(
      new URL(
        `/auth/verification-failed?reason=server_error&message=${encodeURIComponent(error.message)}`,
        request.url,
      ),
    )
  }
}
