"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, CheckCircle, Brain } from "lucide-react"
import Link from "next/link"
import type { Assessment, AssessmentTemplate } from "@/lib/supabase"

interface AssessmentsClientPageProps {
  templates: AssessmentTemplate[]
  completed: Assessment[]
  userId: string
}

export default function AssessmentsClientPage({ templates, completed, userId }: AssessmentsClientPageProps) {
  const [available, setAvailable] = useState(templates)
  const [completedList, setCompletedList] = useState(completed)

  const handleStartAssessment = (templateId: string) => {
    // Logic to start a new assessment
    console.log(`Starting assessment ${templateId} for user ${userId}`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Оценки</h1>
        <p className="text-gray-600">Оцените свои навыки и получите персональные рекомендации</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Доступные оценки
            </CardTitle>
            <CardDescription>Начните оценку, чтобы лучше понять себя</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {available.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <Badge variant="secondary">{template.type}</Badge>
                  </div>
                  <Link href={`/assessments/start/${template.id}`} passHref>
                    <Button size="sm">
                      Начать
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Completed Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Пройденные оценки
            </CardTitle>
            <CardDescription>Ваши результаты и история</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedList.length > 0 ? (
              completedList.map((assessment) => (
                <Card key={assessment.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Пройдено: {new Date(assessment.completed_at!).toLocaleDateString()}
                      </p>
                      <Badge>Результат: {assessment.score}%</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Посмотреть
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Вы еще не прошли ни одной оценки.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
