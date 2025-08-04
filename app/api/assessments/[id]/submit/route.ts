import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AssessmentsService } from "@/lib/services/assessments"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { answers } = await request.json()
    const assessmentId = params.id

    // Проверяем, что пользователь является владельцем этой оценки
    const { data: existingAssessment } = await supabase
      .from("assessments")
      .select("id")
      .eq("id", assessmentId)
      .eq("user_id", user.id)
      .single()

    if (!existingAssessment) {
      return NextResponse.json({ error: "Assessment not found or access denied" }, { status: 404 })
    }

    const result = await AssessmentsService.submitAssessment(assessmentId, answers)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Assessment submission error:", error)
    return NextResponse.json({ error: "Failed to submit assessment" }, { status: 500 })
  }
}
