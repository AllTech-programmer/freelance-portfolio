import { type NextRequest, NextResponse } from "next/server"
import { portfolioDb } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = portfolioDb.getById(params.id)
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedItem = portfolioDb.update(params.id, body)

    if (!updatedItem) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = portfolioDb.delete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Portfolio item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
  }
}
