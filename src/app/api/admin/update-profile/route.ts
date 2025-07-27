import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"

interface JWTPayload {
  id: string
  username: string
  role?: string
  iat: number
  exp: number
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: JWTPayload
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    const { username, currentPassword, newPassword } = await request.json()

    // Basic validation
    if (!username?.trim()) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 })
    }

    // Get current admin data
    const { data: currentAdmin, error: fetchError } = await supabaseAdmin
      .from("admin")
      .select("*")
      .eq("id", decoded.id)
      .single()

    if (fetchError || !currentAdmin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 })
    }

    // Check username uniqueness if changed
    if (username.trim() !== currentAdmin.username) {
      const { data: existingAdmin } = await supabaseAdmin
        .from("admin")
        .select("id")
        .eq("username", username.trim())
        .neq("id", currentAdmin.id)
        .single()

      if (existingAdmin) {
        return NextResponse.json({ success: false, message: "Username already exists" }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = {
      username: username.trim(),
      updated_at: new Date().toISOString(),
    }

    let passwordChanged = false

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: "Current password is required" }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters" },
          { status: 400 },
        )
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, currentAdmin.password)
      if (!isValidPassword) {
        return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      updateData.password = hashedNewPassword
      passwordChanged = true

      // Update token_invalidated_at untuk invalidasi semua token lama
      updateData.token_invalidated_at = new Date().toISOString()
    }

    // Update admin profile
    const { error: updateError } = await supabaseAdmin.from("admin").update(updateData).eq("id", currentAdmin.id)

    if (updateError) {
      return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 })
    }

    // Jika password berubah, paksa logout
    if (passwordChanged) {
      return NextResponse.json({
        success: true,
        message: "Password updated successfully. Please login again with your new password.",
        requireReauth: true, // Flag untuk frontend
        passwordChanged: true,
      })
    }

    // Generate new token jika hanya username yang berubah
    let newToken = null
    if (username.trim() !== currentAdmin.username) {
      newToken = jwt.sign(
        {
          id: currentAdmin.id,
          username: username.trim(),
          role: currentAdmin.role || "admin",
        },
        JWT_SECRET,
        { expiresIn: "24h" }, // Changed from 1m to 24h
      )
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      newToken,
      admin: {
        id: currentAdmin.id,
        username: username.trim(),
        role: currentAdmin.role,
        updated_at: updateData.updated_at,
      },
    })
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
