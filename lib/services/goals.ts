import { typedSupabase } from "../supabase"

export class GoalsService {
  // Получить все цели пользователя
  static async getUserGoals(userId: string) {
    const { data, error } = await typedSupabase
      .from("goals")
      .select(`
    *,
    subgoals:goals!parent_goal_id(*)
  `)
      .eq("user_id", userId)
      .eq("goal_type", "main")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Создать новую цель
  static async createGoal(goalData: {
    user_id: string
    title: string
    description?: string
    category?: string
    priority?: "high" | "medium" | "low" | undefined // Updated type to be optional
    deadline?: string
    parent_goal_id?: string
    goal_type?: "main" | "sub"
    weight?: number
  }) {
    const { data, error } = await typedSupabase.from("goals").insert([goalData]).select().single()

    if (error) throw error
    return data
  }

  // Обновить прогресс цели
  static async updateGoalProgress(goalId: string, progress: number) {
    const { data, error } = await typedSupabase.from("goals").update({ progress }).eq("id", goalId).select().single()

    if (error) throw error
    return data
  }

  // Создать подцели для основной цели
  static async createSubGoals(
    parentGoalId: string,
    subGoals: Array<{
      title: string
      description?: string
      weight: number
      deadline?: string
      order_index: number
    }>,
  ) {
    const { data: parentGoal, error: parentError } = await typedSupabase
      .from("goals")
      .select("user_id")
      .eq("id", parentGoalId)
      .single()

    if (parentError) throw parentError

    const subGoalsData = subGoals.map((subGoal) => ({
      ...subGoal,
      user_id: parentGoal.user_id,
      parent_goal_id: parentGoalId,
      goal_type: "sub" as const,
      progress: 0,
      status: "active" as const,
    }))

    const { data, error } = await typedSupabase.from("goals").insert(subGoalsData).select()

    if (error) throw error
    return data
  }

  // Получить подцели
  static async getSubGoals(parentGoalId: string) {
    const { data, error } = await typedSupabase
      .from("goals")
      .select("*")
      .eq("parent_goal_id", parentGoalId)
      .eq("goal_type", "sub")
      .order("order_index", { ascending: true })

    if (error) throw error
    return data
  }

  // Удалить цель
  static async deleteGoal(goalId: string) {
    const { error } = await typedSupabase.from("goals").delete().eq("id", goalId)

    if (error) throw error
  }

  // Получить статистику целей пользователя
  static async getGoalsStats(userId: string) {
    const { data, error } = await typedSupabase.from("goals").select("status, progress").eq("user_id", userId)

    if (error) throw error

    const stats = {
      total: data.length,
      active: data.filter((g) => g.status === "active").length,
      completed: data.filter((g) => g.status === "completed").length,
      averageProgress: data.length > 0 ? Math.round(data.reduce((sum, g) => sum + g.progress, 0) / data.length) : 0,
    }

    return stats
  }
}
