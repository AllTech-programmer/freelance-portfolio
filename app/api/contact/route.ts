import { type NextRequest, NextResponse } from "next/server"
import { contactDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const submission = contactDb.create({ name, email, message })

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        id: submission.id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const submissions = contactDb.getAll()
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact submissions" }, { status: 500 })
  }
}
