import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const SubGoalSchema = z.object({
  title: z.string(),
  description: z.string(),
  weight: z.number().min(0.1).max(3),
  deadline: z.string().optional(),
  estimatedDuration: z.string(),
  prerequisites: z.array(z.string()).optional(),
})

const DecompositionSchema = z.object({
  subGoals: z.array(SubGoalSchema),
  suggestions: z.array(z.string()),
  timeline: z.string(),
  riskFactors: z.array(z.string()),
  successMetrics: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Goal Decomposition API: OPENAI_API_KEY is not set.")
      return NextResponse.json({ error: "AI service is not configured on the server." }, { status: 500 })
    }

    const { mainGoal, context } = await request.json()

    if (!mainGoal || !mainGoal.title) {
      return NextResponse.json({ error: "Main goal with a title is required." }, { status: 400 })
    }

    const prompt = `Ты - профессиональный коуч, специализирующийся на декомпозиции целей. 
    
ГЛАВНАЯ ЦЕЛЬ:
Название: ${mainGoal.title}
Описание: ${mainGoal.description || "Не указано"}
Текущий прогресс: ${mainGoal.progress}%

КОНТЕКСТ: ${context}

ЗАДАЧА: Разбей эту цель на 3-6 логических подцелей, используя принципы SMART и научные методы достижения целей.

ПРИНЦИПЫ ДЕКОМПОЗИЦИИ:
1. Каждая подцель должна быть конкретной и измеримой
2. Подцели должны быть логически связаны и последовательны
3. Учитывай психологические аспекты мотивации
4. Используй принцип "маленьких побед" для поддержания мотивации
5. Каждая подцель должна приближать к основной цели

ВЕСА ПОДЦЕЛЕЙ:
- 0.5-0.8: Подготовительные этапы
- 1.0: Стандартные подцели
- 1.5-2.0: Ключевые этапы
- 2.5-3.0: Критически важные подцели

Также дай практические советы по реализации и потенциальные риски.`

    const { object: decompositionResult } = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schema: DecompositionSchema,
      temperature: 0.7,
    })

    const enhancedSubGoals = decompositionResult.subGoals.map((subGoal, index) => ({
      ...subGoal,
      id: `ai-sub-${Date.now()}-${index}`,
      progress: 0,
      status: "not_started" as const,
      orderIndex: index,
    }))

    return NextResponse.json({
      subGoals: enhancedSubGoals,
      suggestions: decompositionResult.suggestions,
      timeline: decompositionResult.timeline,
      riskFactors: decompositionResult.riskFactors,
      successMetrics: decompositionResult.successMetrics,
    })
  } catch (error: any) {
    console.error("[Goal Decomposition API Error]", error)
    return NextResponse.json({ error: `Failed to decompose goal: ${error.message}` }, { status: 500 })
  }
}
