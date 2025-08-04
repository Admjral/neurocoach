import { type NextRequest, NextResponse } from "next/server"
import { GoalsService } from "@/lib/services/goals"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const goals = await GoalsService.getUserGoals(userId)
    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Goals fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const goalData = await request.json()
    const goal = await GoalsService.createGoal(goalData)
    return NextResponse.json({ goal })
  } catch (error) {
    console.error("Goal creation error:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}
