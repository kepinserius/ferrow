import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { v4 as uuidv4 } from "uuid"
import { Resend } from "resend"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, message: "Email and Name are required." }, { status: 400 })
    }

    // 1. Check if user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing user:", fetchError)
      throw new Error("Database error during user lookup.")
    }

    let user
    let message = ""
    let verificationToken = ""

    if (existingUser) {
      // User already exists
      if (existingUser.email_verified) {
        // User is already verified, direct login
        user = existingUser
        message = "Login successful."

        // Return success immediately for verified users
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            email_verified: user.email_verified,
          },
          message,
        })
      } else {
        // User not verified, request verification
        message = "Akun belum diverifikasi. Email verifikasi telah dikirim ulang."
        verificationToken = existingUser.verification_token || uuidv4()

        if (!existingUser.verification_token) {
          await supabaseAdmin
            .from("users")
            .update({
              verification_token: verificationToken,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingUser.id)
        }
        user = existingUser
      }
    } else {
      // New user, register
      verificationToken = uuidv4()
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone?.trim() || null,
          email_verified: false,
          verification_token: verificationToken,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting new user:", insertError)
        throw new Error("Gagal mendaftarkan pengguna.")
      }

      user = newUser
      message = "Pendaftaran berhasil. Email verifikasi telah dikirim."
    }

    // Send verification email ONLY if user is not verified
    if (user && !user.email_verified) {
      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}`

      try {
        const { data, error: resendError } = await resend.emails.send({
          from: "Ferrow <onboarding@resend.dev>", // You can customize this
          to: [email],
          subject: "🐾 Verifikasi Akun Ferrow Anda",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verifikasi Akun Ferrow</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f5f3f0 0%, #e8e5e0 100%); padding: 30px; border-radius: 15px; text-align: center;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <h1 style="color: #2d4a3e; margin-bottom: 20px; font-size: 28px;">🐾 Selamat Datang di Ferrow!</h1>
                  
                  <p style="font-size: 18px; color: #2d4a3e; margin-bottom: 25px;">
                    Halo <strong>${name}</strong>,
                  </p>
                  
                  <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
                    Terima kasih telah bergabung dengan keluarga Ferrow! Kami sangat senang Anda memilih produk terbaik untuk hewan kesayangan Anda.
                  </p>
                  
                  <div style="background: #f8f6f3; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <p style="font-size: 16px; color: #2d4a3e; margin-bottom: 20px;">
                      Untuk menyelesaikan pendaftaran dan mulai berbelanja, silakan klik tombol di bawah ini:
                    </p>
                    
                    <a href="${verificationLink}" 
                       style="display: inline-block; background: #2d4a3e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 10px 0;">
                      ✅ Verifikasi Akun Saya
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #888; margin-top: 25px;">
                    Atau salin dan tempel tautan ini di browser Anda:<br>
                    <span style="background: #f0f0f0; padding: 8px; border-radius: 4px; word-break: break-all; display: inline-block; margin-top: 8px;">
                      ${verificationLink}
                    </span>
                  </p>
                  
                  <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
                    <p style="font-size: 14px; color: #888;">
                      Jika Anda tidak mendaftar untuk akun ini, Anda dapat mengabaikan email ini dengan aman.
                    </p>
                    
                    <p style="font-size: 16px; color: #2d4a3e; margin-top: 20px;">
                      Hormat kami,<br>
                      <strong>Tim Ferrow 🐾</strong><br>
                      <em>Untuk hewan kesayangan terbaik</em>
                    </p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        })

        if (resendError) {
          console.error("Error sending verification email with Resend:", resendError)
          message += " Namun, gagal mengirim email verifikasi. Silakan coba lagi nanti."
        } else {
          console.log("Verification email sent successfully via Resend:", data)
        }
      } catch (emailSendError) {
        console.error("Unexpected error during email sending:", emailSendError)
        message += " Namun, terjadi kesalahan saat mengirim email verifikasi."
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        email_verified: user.email_verified,
      },
      message,
      requiresVerification: !user.email_verified,
    })
  } catch (error: any) {
    console.error("API Signin Error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan tak terduga." },
      { status: 500 },
    )
  }
}
