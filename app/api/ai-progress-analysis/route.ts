import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  actionSteps: z.array(z.string()),
  estimatedImpact: z.string(),
})

const SubGoalAnalysisSchema = z.object({
  title: z.string(),
  progress: z.number(),
  status: z.enum(["on_track", "at_risk", "behind"]),
  feedback: z.string(),
  blockers: z.array(z.string()).optional(),
})

const ProgressAnalysisSchema = z.object({
  trend: z.enum(["improving", "declining", "stable"]),
  efficiency: z.number(),
  estimatedCompletion: z.string(),
  overallAssessment: z.string(),
  subGoalAnalysis: z.array(SubGoalAnalysisSchema),
  recommendations: z.array(RecommendationSchema),
  sessionImpact: z.object({
    averageGain: z.number(),
    mostEffectiveType: z.string(),
    recommendedFrequency: z.string(),
  }),
  riskFactors: z.array(z.string()),
  strengths: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const { mainGoal, subGoals, sessions } = await request.json()

    const prompt = `Ты - профессиональный ИИ коуч-аналитик. Проанализируй прогресс пользователя по его цели.

ОСНОВНАЯ ЦЕЛЬ:
Название: ${mainGoal.title}
Описание: ${mainGoal.description || "Не указано"}
Текущий прогресс: ${mainGoal.progress}%

ПОДЦЕЛИ (${subGoals?.length || 0}):
${
  subGoals?.map((sg: any, i: number) => `${i + 1}. ${sg.title} - ${sg.progress}% (вес: ${sg.weight})`).join("\n") ||
  "Подцели не созданы"
}

ПРОВЕДЕННЫЕ СЕССИИ (${sessions?.length || 0}):
${
  sessions?.map((s: any, i: number) => `${i + 1}. ${s.type} - ${s.duration}мин, рейтинг: ${s.rating}/5`).join("\n") ||
  "Сессии не проводились"
}

ЗАДАЧИ АНАЛИЗА:
1. Оцени общий тренд прогресса (улучшается/стабильно/снижается)
2. Рассчитай эффективность движения к цели (0-100%)
3. Спрогнозируй время достижения цели
4. Проанализируй каждую подцель отдельно
5. Дай конкретные рекомендации для улучшения
6. Оцени влияние сессий на прогресс
7. Выяви риски и сильные стороны

ПРИНЦИПЫ АНАЛИЗА:
- Используй научные методы оценки прогресса
- Учитывай психологические факторы мотивации
- Давай конкретные, действенные рекомендации
- Фокусируйся на решениях, а не на проблемах
- Поддерживай мотивацию пользователя

Будь честным, но конструктивным в оценках.`

    const result = await generateObject({
      model: openai("gpt-4o", { apiKey: process.env.OPENAI_API_KEY }),
      prompt,
      schema: ProgressAnalysisSchema,
      temperature: 0.3, // Более низкая температура для точного анализа
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Progress analysis error:", error)
    return NextResponse.json({ error: "Ошибка анализа прогресса" }, { status: 500 })
  }
}
