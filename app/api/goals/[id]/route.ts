import { type NextRequest, NextResponse } from "next/server"
import { GoalsService } from "@/lib/services/goals"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { progress } = await request.json()
    const goal = await GoalsService.updateGoalProgress(params.id, progress)
    return NextResponse.json({ goal })
  } catch (error) {
    console.error("Goal update error:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await GoalsService.deleteGoal(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Goal deletion error:", error)
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 })
  }
}
