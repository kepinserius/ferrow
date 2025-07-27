import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Missing credentials" }, { status: 400 })
    }

    // Query Supabase untuk mencari admin berdasarkan username
    const { data: admin, error } = await supabaseAdmin.from("admin").select("*").eq("username", username).single()

    if (error || !admin) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }

    // Bandingkan password menggunakan bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role || "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    )

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role || "admin",
          created_at: admin.created_at,
          updated_at: admin.updated_at,
        },
      },
    })
  } catch (error) {
    console.error("[ADMIN LOGIN ERROR]", error)
    return NextResponse.json({ success: false, message: "Server error, please try again later." }, { status: 500 })
  }
}
