import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssessmentsService } from "@/lib/services/assessments"

export const dynamic = "force-dynamic"

interface PageProps {
  params: { templateId: string }
}

// Эта страница-действие создает экземпляр оценки и перенаправляет пользователя на страницу ее прохождения
export default async function StartAssessmentPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  try {
    console.log("Creating assessment for user:", user.id, "template:", params.templateId)

    const newAssessment = await AssessmentsService.createAssessment(user.id, params.templateId)

    if (!newAssessment) {
      throw new Error("Assessment creation failed - no data returned")
    }

    console.log("Assessment created successfully:", newAssessment.id)

    // Перенаправляем на страницу прохождения теста
    redirect(`/assessments/${newAssessment.id}`)
  } catch (error: any) {
    console.error("Failed to start assessment:", error)

    // Более детальная обработка ошибок
    const errorMessage = error.message || "Unknown error occurred"
    const encodedError = encodeURIComponent(errorMessage)

    redirect(`/assessments?error=creation_failed&details=${encodedError}`)
  }
}
