import { createClient } from "@/lib/supabase/server"
import DashboardClientPage from "./client-page"
import type { Goal } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // This should be handled by middleware, but as a fallback
    return null
  }

  // Fetch goals with subgoals
  const { data: goalsData } = await supabase
    .from("goals")
    .select(
      `
      *,
      subgoals:goals!parent_goal_id(*)
    `,
    )
    .eq("user_id", user.id)
    .eq("goal_type", "main")
    .order("created_at", { ascending: false })

  const goals = (goalsData as (Goal & { subgoals: Goal[] })[]) || []

  // Fetch stats
  const { data: sessionsData } = await supabase
    .from("coaching_sessions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "completed")

  const stats = {
    activeGoals: goals.filter((g) => g.status === "active").length,
    completedSessions: sessionsData?.length || 0,
    averageProgress:
      goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) : 0,
    streakDays: 0, // This would require more complex logic, mocking for now
  }

  return <DashboardClientPage initialGoals={goals} initialStats={stats} userId={user.id} />
}
