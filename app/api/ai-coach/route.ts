import { type NextRequest, NextResponse } from "next/server"
import { streamText, type CoreMessage } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  // Проверяем наличие API ключа в самом начале
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    console.error("AI Coach API Error: OPENAI_API_KEY is not set.")
    // Возвращаем специальную ошибку, которую фронтенд сможет распознать
    return NextResponse.json(
      {
        error: "AI service is not configured.",
        code: "MISSING_API_KEY",
      },
      { status: 500 },
    )
  }

  try {
    const { messages }: { messages: CoreMessage[] } = await request.json()

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[AI Coach API Error]", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred with the AI service.",
        code: "AI_SERVICE_ERROR",
        details: error.message,
      },
      { status: 503 },
    )
  }
}
