import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CoachSessionClient } from "./coach-session-client"
import { PageLoader } from "@/components/page-loader"
import type { Profile } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ type?: string }>
}

async function SessionContent({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const params = await searchParams
  const sessionType = (params.type as any) || "goal-setting"

  // Параллельные запросы для ускорения
  const [userProfileResult, currentGoalsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("goal_type", "main")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ])

  return (
    <CoachSessionClient
      userId={user.id}
      sessionType={sessionType}
      userProfile={userProfileResult.data}
      currentGoals={currentGoalsResult.data || []}
    />
  )
}

export default function CoachSessionPage(props: PageProps) {
  return (
    <Suspense fallback={<PageLoader isLoading={true} message="Подготавливаем сессию..." />}>
      <SessionContent {...props} />
    </Suspense>
  )
}
