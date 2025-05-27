import { type NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/db"
import { createSession, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt:", { email, passwordLength: password?.length })

    if (!email || !password) {
      console.log("Missing credentials")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = userDb.findByEmail(email)
    console.log("User found:", user ? { id: user.id, email: user.email, role: user.role } : "No user found")

    if (!user) {
      console.log("User not found for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordValid = verifyPassword(password, user.password)
    console.log("Password valid:", passwordValid)

    if (!passwordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionId = createSession(user.id, user.email, user.role)
    console.log("Session created:", sessionId)

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    })

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("Login successful for:", email)
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
