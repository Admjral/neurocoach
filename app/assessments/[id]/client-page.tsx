"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Assessment } from "@/lib/supabase"
import { Brain, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface AssessmentTakerClientPageProps {
  assessment: Assessment
}

export default function AssessmentTakerClientPage({ assessment }: AssessmentTakerClientPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const questions = assessment.questions as any[]
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const progress = Math.round(((currentStep + 1) / questions.length) * 100)
  const currentQuestion = questions[currentStep]

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/assessments/${assessment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error("Не удалось завершить оценку.")
      }

      toast({
        title: "Оценка завершена!",
        description: "Сейчас вы увидите свои результаты.",
      })

      router.push(`/assessments/${assessment.id}/results`)
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "scale":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, Number(value))}
            className="space-y-2"
          >
            {Array.from({ length: question.scale.max }, (_, i) => i + 1).map((value) => (
              <Label
                key={value}
                className="flex items-center gap-4 border rounded-md p-3 cursor-pointer hover:bg-accent"
              >
                <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                <span>
                  {value} - {question.scale.labels[value]}
                </span>
              </Label>
            ))}
          </RadioGroup>
        )
      case "multiple_choice":
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-2"
          >
            {question.options.map((option: string) => (
              <Label
                key={option}
                className="flex items-center gap-4 border rounded-md p-3 cursor-pointer hover:bg-accent"
              >
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        )
      default:
        return <p>Неизвестный тип вопроса</p>
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>
                Вопрос {currentStep + 1} из {questions.length}
              </CardDescription>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
            {renderQuestion(currentQuestion)}
          </div>
        </CardContent>
        <div className="p-6 border-t flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          {currentStep < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
              Далее
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading || !answers[currentQuestion.id]}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Завершение..." : "Завершить оценку"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
