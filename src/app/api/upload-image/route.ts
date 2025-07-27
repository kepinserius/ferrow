import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD API CALLED ===")

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error("Supabase admin client not available")
      return NextResponse.json({ error: "Storage service not available" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const filePath = formData.get("filePath") as string

    console.log("File received:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    })
    console.log("File path:", filePath)

    if (!file) {
      console.log("No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!filePath) {
      console.log("No file path provided")
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size)
      return NextResponse.json({ error: "File too large. Maximum size: 5MB" }, { status: 400 })
    }

    // Convert file to buffer
    console.log("Converting file to buffer...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log("Buffer created, size:", buffer.length)

    console.log("Uploading to Supabase Storage...")

    // Upload to Supabase Storage using admin client
    const { data, error: uploadError } = await supabaseAdmin.storage.from("product-images").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message}`,
          details: uploadError,
        },
        { status: 500 },
      )
    }

    console.log("Upload successful:", data)

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(filePath)

    console.log("Public URL generated:", urlData.publicUrl)

    return NextResponse.json({
      success: true,
      publicUrl: urlData.publicUrl,
      path: filePath,
      message: "Upload successful",
    })
  } catch (error: any) {
    console.error("=== UPLOAD API ERROR ===", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Upload API is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}
