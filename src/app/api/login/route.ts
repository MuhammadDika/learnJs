import { NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/users"

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
