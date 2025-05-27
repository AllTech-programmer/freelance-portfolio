import { type NextRequest, NextResponse } from "next/server"
import { portfolioDb } from "@/lib/db"

export async function GET() {
  try {
    const items = portfolioDb.getAll()
    console.log("Fetching portfolio items:", items.length, "items found")

    // Log each item to debug
    items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        title: item.title,
        hasImage: !!item.imageUrl,
        imageUrlLength: item.imageUrl?.length || 0,
      })
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, price, description, imageUrl, featured } = body

    console.log("Creating portfolio item:", {
      title,
      category,
      price,
      hasImage: !!imageUrl,
      imageUrlLength: imageUrl?.length || 0,
    })

    if (!title || !category || !price || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newItem = portfolioDb.create({
      title,
      category,
      price,
      description,
      imageUrl: imageUrl || "/placeholder.svg?height=300&width=400",
      featured: featured || false,
    })

    console.log("Portfolio item created successfully:", {
      id: newItem.id,
      title: newItem.title,
      hasImage: !!newItem.imageUrl,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
}
