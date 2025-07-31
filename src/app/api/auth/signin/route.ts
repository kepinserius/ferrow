import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { v4 as uuidv4 } from "uuid" // Untuk menghasilkan UUID
import { Resend } from "resend" // Import Resend

// Inisialisasi Resend dengan kunci API Anda
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, message: "Email and Name are required." }, { status: 400 })
    }

    // 1. Cek apakah pengguna sudah ada
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error fetching existing user:", fetchError)
      throw new Error("Database error during user lookup.")
    }

    let user
    let message = ""
    let verificationToken = "" // Deklarasikan di luar blok if/else

    if (existingUser) {
      // Pengguna sudah ada
      if (existingUser.email_verified) {
        // Pengguna sudah diverifikasi, langsung login
        user = existingUser
        message = "Login successful."
      } else {
        // Pengguna belum diverifikasi, minta verifikasi
        message = "Akun belum diverifikasi. Silakan periksa email Anda untuk tautan verifikasi."
        // Gunakan token yang sudah ada atau buat yang baru jika null
        verificationToken = existingUser.verification_token || uuidv4()
        if (!existingUser.verification_token) {
          // Jika token null, update di DB
          await supabaseAdmin
            .from("users")
            .update({ verification_token: verificationToken, updated_at: new Date().toISOString() })
            .eq("id", existingUser.id)
        }
        user = existingUser // Pastikan user diatur untuk pengiriman email
      }
    } else {
      // Pengguna baru, daftar
      verificationToken = uuidv4() // Generate token verifikasi

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          email,
          name,
          phone,
          email_verified: false, // Default to false for new registrations
          verification_token: verificationToken,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting new user:", insertError)
        throw new Error("Gagal mendaftarkan pengguna.")
      }

      user = newUser
      message = "Pendaftaran berhasil. Silakan periksa email Anda untuk memverifikasi akun Anda."
    }

    // Kirim email verifikasi HANYA jika pengguna belum diverifikasi
    if (user && !user.email_verified) {
      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}`

      try {
        const { data, error: resendError } = await resend.emails.send({
          from: "Ferrow <onboarding@resend.dev>", // Ganti dengan email terverifikasi Anda di Resend
          to: [email],
          subject: "Verifikasi Akun Ferrow Anda",
          html: `
            <p>Halo ${name},</p>
            <p>Terima kasih telah mendaftar di Ferrow!</p>
            <p>Silakan klik tautan di bawah ini untuk memverifikasi akun Anda dan menyelesaikan pendaftaran:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Jika Anda tidak mendaftar untuk akun ini, Anda dapat mengabaikan email ini.</p>
            <p>Hormat kami,<br/>Tim Ferrow</p>
          `,
        })

        if (resendError) {
          console.error("Error sending verification email with Resend:", resendError)
          // Jangan lempar error di sini agar pendaftaran tetap berhasil,
          // tapi berikan pesan yang sesuai kepada pengguna.
          message += " Namun, gagal mengirim email verifikasi. Silakan coba lagi nanti atau hubungi dukungan."
        } else {
          console.log("Verification email sent successfully via Resend:", data)
        }
      } catch (emailSendError) {
        console.error("Unexpected error during email sending:", emailSendError)
        message += " Namun, terjadi kesalahan tak terduga saat mengirim email verifikasi."
      }
    }

    return NextResponse.json({ success: true, user, message })
  } catch (error: any) {
    console.error("API Signin Error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan tak terduga." },
      { status: 500 },
    )
  }
}
