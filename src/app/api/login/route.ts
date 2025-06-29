import { NextRequest, NextResponse } from "next/server"

// In-memory user store - in production, this should be a database
const initialUsers = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
]

// This is a simple in-memory store for demo purposes
// In production, use a proper database
let users = [...initialUsers]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      return NextResponse.json({ success: true, message: "Login successful" })
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    )
  }
}
