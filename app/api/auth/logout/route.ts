import { type NextRequest, NextResponse } from "next/server"
import { deleteSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (sessionId) {
      deleteSession(sessionId)
    }

    const response = NextResponse.json({ message: "Logout successful" })
    response.cookies.delete("session")

    return response
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
