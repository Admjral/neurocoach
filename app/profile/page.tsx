import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfilesService } from "@/lib/services/profiles"
import ProfileClientPage from "./client-page"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const profile = await ProfilesService.getProfile(user.id)

  if (!profile) {
    // This case should ideally not happen due to the trigger
    return <div>Профиль не найден.</div>
  }

  return <ProfileClientPage userProfile={profile} />
}
