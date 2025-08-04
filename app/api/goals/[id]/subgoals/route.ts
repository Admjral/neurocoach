import { type NextRequest, NextResponse } from "next/server"
import { GoalsService } from "@/lib/services/goals"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { subGoals } = await request.json()
    const data = await GoalsService.createSubGoals(params.id, subGoals)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Sub-goal creation error:", error)
    return NextResponse.json({ error: "Failed to create sub-goals" }, { status: 500 })
  }
}
