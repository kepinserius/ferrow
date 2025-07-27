import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
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
    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No token provided",
          requireReauth: true 
        }, 
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: JWTPayload

    // Verify JWT token
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error: any) {
      console.error("JWT verification error:", error)
      
      if (error.name === "TokenExpiredError") {
        return NextResponse.json(
          { 
            success: false, 
            message: "Token expired. Please login again.",
            requireReauth: true 
          }, 
          { status: 401 }
        )
      }
      
      if (error.name === "JsonWebTokenError") {
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid token. Please login again.",
            requireReauth: true 
          }, 
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Token verification failed. Please login again.",
          requireReauth: true 
        }, 
        { status: 401 }
      )
    }

    // Validate token payload
    if (!decoded.id || !decoded.username) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid token payload. Please login again.",
          requireReauth: true 
        }, 
        { status: 401 }
      )
    }

    // Find admin by ID from token
    const { data: admin, error } = await supabaseAdmin
      .from("admin")
      .select("id, username, role, created_at, updated_at, token_invalidated_at")
      .eq("id", decoded.id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { 
          success: false, 
          message: "Database error occurred",
          requireReauth: true 
        }, 
        { status: 500 }
      )
    }

    if (!admin) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Admin account not found. Please login again.",
          requireReauth: true 
        }, 
        { status: 404 }
      )
    }

    // Verify username matches (additional security check)
    if (admin.username !== decoded.username) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Token mismatch. Please login again.",
          requireReauth: true 
        }, 
        { status: 401 }
      )
    }

    // Check if token was issued before password change
    if (admin.token_invalidated_at) {
      const tokenIssuedAt = new Date(decoded.iat * 1000)
      const tokenInvalidatedAt = new Date(admin.token_invalidated_at)
      
      if (tokenIssuedAt < tokenInvalidatedAt) {
        return NextResponse.json(
          {
            success: false,
            message: "Token invalidated due to password change. Please login again.",
            requireReauth: true,
          },
          { status: 401 }
        )
      }
    }

    // Token is valid, return admin data
    return NextResponse.json({
      success: true,
      message: "Token verified successfully",
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role || "admin",
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      },
    })

  } catch (error: any) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error. Please try again.",
        requireReauth: true 
      }, 
      { status: 500 }
    )
  }
}