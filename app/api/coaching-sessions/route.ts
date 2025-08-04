import { type NextRequest, NextResponse } from "next/server"
import { CoachingService } from "@/lib/services/coaching"

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()
    const session = await CoachingService.createSession(sessionData)
    return NextResponse.json({ session })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const sessions = await CoachingService.getUserSessions(userId, limit)
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
