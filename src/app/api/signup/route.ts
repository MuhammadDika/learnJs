import { NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      )
    }

    const existingUser = users.find((u) => u.username === username)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 409 }
      )
    }

    // Add new user to the in-memory store
    users.push({ username, password })

    return NextResponse.json({ success: true, message: "User created successfully" })
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    )
  }
}
