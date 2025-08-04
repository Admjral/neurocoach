import { typedSupabase } from "../supabase"

export class CoachingService {
  // Создать новую сессию
  static async createSession(sessionData: {
    user_id: string
    session_type: "goal-setting" | "progress-review" | "problem-solving" | "emotional-support"
    title: string
    goals_discussed?: string[]
  }) {
    const { data, error } = await typedSupabase
      .from("coaching_sessions")
      .insert([
        {
          ...sessionData,
          status: "in_progress",
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Обновить сессию
  static async updateSession(
    sessionId: string,
    updates: {
      transcript?: string
      insights?: any[]
      action_items?: any[]
      mood_before?: number
      mood_after?: number
      session_rating?: number
      duration_minutes?: number
      ai_analysis?: any
      status?: "scheduled" | "in_progress" | "completed" | "cancelled"
    },
  ) {
    const { data, error } = await typedSupabase
      .from("coaching_sessions")
      .update({
        ...updates,
        completed_at: updates.status === "completed" ? new Date().toISOString() : undefined,
      })
      .eq("id", sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Получить сессии пользователя
  static async getUserSessions(userId: string, limit = 10) {
    const { data, error } = await typedSupabase
      .from("coaching_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Получить статистику сессий
  static async getSessionsStats(userId: string) {
    const { data, error } = await typedSupabase
      .from("coaching_sessions")
      .select("session_type, status, session_rating, duration_minutes")
      .eq("user_id", userId)

    if (error) throw error

    const completed = data.filter((s) => s.status === "completed")
    const stats = {
      total: data.length,
      completed: completed.length,
      averageRating:
        completed.length > 0 ? completed.reduce((sum, s) => sum + (s.session_rating || 0), 0) / completed.length : 0,
      totalDuration: completed.reduce((sum, s) => sum + s.duration_minutes, 0),
      mostCommonType: this.getMostCommonSessionType(data),
    }

    return stats
  }

  private static getMostCommonSessionType(sessions: any[]) {
    const counts = sessions.reduce((acc, session) => {
      acc[session.session_type] = (acc[session.session_type] || 0) + 1
      return acc
    }, {})

    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "")
  }
}
