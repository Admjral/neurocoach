import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import GoalsClientPage from "./client-page"
import { GoalsService } from "@/lib/services/goals"

export const dynamic = "force-dynamic"

export default async function GoalsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const goals = await GoalsService.getUserGoals(user.id)

  return <GoalsClientPage initialGoals={goals || []} userId={user.id} />
}
