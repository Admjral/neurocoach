import { typedSupabase } from "../supabase"

export class AnalyticsService {
  // Получить данные для аналитики
  static async getAnalyticsData(userId: string) {
    // Параллельные запросы для эффективности
    const [goalsData, sessionsData, progressData] = await Promise.all([
      // Все цели
      typedSupabase
        .from("goals")
        .select("category, status, progress, created_at")
        .eq("user_id", userId),
      // Все сессии
      typedSupabase
        .from("coaching_sessions")
        .select("session_type, status, created_at")
        .eq("user_id", userId),
      // Все записи о прогрессе
      typedSupabase
        .from("progress_tracking")
        .select("created_at, progress_delta")
        .eq("user_id", userId),
    ])

    if (goalsData.error || sessionsData.error || progressData.error) {
      console.error("Analytics fetch error:", goalsData.error || sessionsData.error || progressData.error)
      throw new Error("Failed to fetch analytics data")
    }

    // Обработка данных
    const goals = goalsData.data || []
    const sessions = sessionsData.data || []
    const progressHistory = progressData.data || []

    // Статистика по целям
    const goalStats = {
      total: goals.length,
      active: goals.filter((g) => g.status === "active").length,
      completed: goals.filter((g) => g.status === "completed").length,
      averageProgress:
        goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) : 0,
      categoryDistribution: this.calculateDistribution(goals, "category"),
    }

    // Статистика по сессиям
    const sessionStats = {
      total: sessions.length,
      completed: sessions.filter((s) => s.status === "completed").length,
      typeDistribution: this.calculateDistribution(sessions, "session_type"),
    }

    // Прогресс по времени
    const progressOverTime = this.calculateProgressOverTime(progressHistory)

    return {
      goalStats,
      sessionStats,
      progressOverTime,
    }
  }

  private static calculateDistribution(items: any[], key: string) {
    const distribution = items.reduce(
      (acc, item) => {
        const value = item[key]
        if (value) {
          acc[value] = (acc[value] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  }

  private static calculateProgressOverTime(history: any[]) {
    const sortedHistory = history.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    let cumulativeProgress = 0
    return sortedHistory.map((entry) => {
      cumulativeProgress += entry.progress_delta || 0
      return {
        date: new Date(entry.created_at).toLocaleDateString("ru-RU"),
        progress: cumulativeProgress,
      }
    })
  }
}
