import { typedSupabase } from "../supabase"
import type { Profile } from "../supabase"

export class ProfilesService {
  // Получить профиль пользователя
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await typedSupabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }
    return data
  }

  // Обновить профиль пользователя
  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await typedSupabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      throw error
    }
    return data
  }
}
