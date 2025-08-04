import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GoalDetailClientPage } from "./client-page"
import type { Goal } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface PageProps {
  params: { id: string }
}

export default async function GoalDetailPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: goalData } = await supabase
    .from("goals")
    .select(
      `
      *,
      subgoals:goals!parent_goal_id(*)
    `,
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!goalData) {
    return <div>Цель не найдена</div>
  }

  const goal = goalData as Goal & { subgoals: Goal[] }

  return <GoalDetailClientPage initialGoal={goal} />
}
