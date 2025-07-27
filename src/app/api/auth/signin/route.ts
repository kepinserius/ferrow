import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone } = body

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new users
      throw checkError
    }

    let user

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          name: name.trim(),
          phone: phone?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select()
        .single()

      if (updateError) throw updateError
      user = updatedUser
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone?.trim() || null,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) throw createError
      user = newUser
    }

    // Return user data (excluding sensitive information)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      email_verified: user.email_verified,
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: existingUser ? "Welcome back!" : "Account created successfully!",
    })
  } catch (error: any) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: error.message || "Failed to sign in" }, { status: 500 })
  }
}
