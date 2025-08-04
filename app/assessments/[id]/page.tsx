import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssessmentsService } from "@/lib/services/assessments"
import AssessmentTakerClientPage from "./client-page"

export const dynamic = "force-dynamic"

interface PageProps {
  params: { id: string }
}

export default async function TakeAssessmentPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const assessment = await AssessmentsService.getAssessmentById(params.id, user.id)

  if (!assessment) {
    return redirect("/assessments?error=not_found")
  }

  // Если оценка уже пройдена, перенаправляем на страницу результатов
  if (assessment.completed_at) {
    return redirect(`/assessments/${assessment.id}/results`)
  }

  return <AssessmentTakerClientPage assessment={assessment} />
}
