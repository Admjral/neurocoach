import type React from "react"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { PageLoader } from "@/components/page-loader"
import type { Profile } from "@/lib/supabase"

async function CoachLayoutContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>()

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader user={profile} />
      <PageTransitionWrapper loadingDelay={50}>{children}</PageTransitionWrapper>
    </div>
  )
}

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader isLoading={true} message="Инициализируем коуча..." />}>
      <CoachLayoutContent>{children}</CoachLayoutContent>
    </Suspense>
  )
}
