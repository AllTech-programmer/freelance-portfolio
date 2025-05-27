import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type (images and videos)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an image (JPG, PNG, GIF, WebP, SVG) or video (MP4, WebM, OGG, AVI, MOV).",
        },
        { status: 400 },
      )
    }

    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith("video/") ? "50MB" : "10MB"
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${maxSizeMB}.`,
        },
        { status: 400 },
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename with timestamp and random string
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop() || "bin"
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${randomString}_${sanitizedOriginalName}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to uploads directory
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, buffer)

    // Create the public URL
    const publicUrl = `/uploads/${filename}`

    console.log("File uploaded successfully:", {
      originalName: file.name,
      filename: filename,
      size: file.size,
      type: file.type,
      publicUrl: publicUrl,
      filePath: filePath,
    })

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 })
  }
}

// GET endpoint to list uploaded files
export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] })
    }

    const { readdir, stat } = await import("fs/promises")
    const files = await readdir(uploadsDir)

    const fileList = await Promise.all(
      files.map(async (filename) => {
        const filePath = join(uploadsDir, filename)
        const stats = await stat(filePath)
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        }
      }),
    )

    return NextResponse.json({ files: fileList })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
