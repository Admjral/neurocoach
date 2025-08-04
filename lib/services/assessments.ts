import { typedSupabase } from "../supabase"

export class AssessmentsService {
  // Получить шаблоны оценок
  static async getTemplates() {
    const { data, error } = await typedSupabase
      .from("assessment_templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Создать оценку на основе шаблона (ИСПРАВЛЕНО)
  static async createAssessment(userId: string, templateId: string) {
    // Сначала получаем шаблон
    const { data: template, error: templateError } = await typedSupabase
      .from("assessment_templates")
      .select("*")
      .eq("id", templateId)
      .single()

    if (templateError) {
      console.error("Template fetch error:", templateError)
      throw new Error("Шаблон оценки не найден")
    }

    // Создаем новую оценку с правильными данными
    const assessmentData = {
      user_id: userId,
      title: template.title,
      type: template.type,
      questions: template.questions,
      answers: null,
      score: null,
      results: null,
      completed_at: null,
    }

    const { data, error } = await typedSupabase.from("assessments").insert([assessmentData]).select().single()

    if (error) {
      console.error("Assessment creation error:", error)
      throw new Error("Не удалось создать оценку: " + error.message)
    }

    return data
  }

  // Сохранить ответы на оценку
  static async submitAssessment(assessmentId: string, answers: any) {
    const score = this.calculateScore(answers)
    const results = this.generateResults(answers, score)

    const { data, error } = await typedSupabase
      .from("assessments")
      .update({
        answers,
        score,
        results,
        completed_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Получить оценки пользователя
  static async getUserAssessments(userId: string) {
    const { data, error } = await typedSupabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Получить оценку по ID
  static async getAssessmentById(assessmentId: string, userId: string) {
    const { data, error } = await typedSupabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching assessment by ID:", error)
      return null
    }
    return data
  }

  // Простой расчет оценки (можно усложнить)
  private static calculateScore(answers: any): number {
    if (!answers || typeof answers !== "object") return 0

    const values = Object.values(answers).filter((v) => typeof v === "number") as number[]
    if (values.length === 0) return 0

    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    return Math.round((average / 5) * 100) // Приводим к шкале 0-100
  }

  // Генерация результатов (упрощенная версия)
  private static generateResults(answers: any, score: number) {
    let level = "Низкий"
    let description = "Есть области для развития"

    if (score >= 80) {
      level = "Высокий"
      description = "Отличные результаты! Продолжайте развиваться."
    } else if (score >= 60) {
      level = "Средний"
      description = "Хорошие результаты с потенциалом для роста."
    } else if (score >= 40) {
      level = "Ниже среднего"
      description = "Есть возможности для значительного улучшения."
    }

    return {
      level,
      description,
      score,
      recommendations: this.getRecommendations(score),
    }
  }

  private static getRecommendations(score: number): string[] {
    if (score >= 80) {
      return ["Поделитесь своим опытом с другими", "Ставьте более амбициозные цели", "Развивайте навыки наставничества"]
    } else if (score >= 60) {
      return ["Практикуйте регулярные упражнения", "Изучите дополнительные техники", "Найдите ментора для развития"]
    } else {
      return ["Начните с базовых упражнений", "Уделяйте время ежедневной практике", "Рассмотрите возможность коучинга"]
    }
  }
}
