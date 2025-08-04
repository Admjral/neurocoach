import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssessmentsService } from "@/lib/services/assessments"
import AssessmentsClientPage from "./client-page"

export const dynamic = "force-dynamic"

export default async function AssessmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const [templates, completedAssessments] = await Promise.all([
    AssessmentsService.getTemplates(),
    AssessmentsService.getUserAssessments(user.id),
  ])

  return <AssessmentsClientPage templates={templates || []} completed={completedAssessments || []} userId={user.id} />
}
