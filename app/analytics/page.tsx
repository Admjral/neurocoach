import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsService } from "@/lib/services/analytics"
import AnalyticsClientPage from "./client-page"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const analyticsData = await AnalyticsService.getAnalyticsData(user.id)

  return <AnalyticsClientPage initialData={analyticsData} />
}
