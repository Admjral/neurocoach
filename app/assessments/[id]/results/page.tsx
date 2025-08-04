import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssessmentsService } from "@/lib/services/assessments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, CheckCircle, ArrowRight, Lightbulb } from "lucide-react"

export const dynamic = "force-dynamic"

interface PageProps {
  params: { id: string }
}

export default async function AssessmentResultsPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const assessment = await AssessmentsService.getAssessmentById(params.id, user.id)

  if (!assessment || !assessment.completed_at) {
    return redirect("/assessments?error=results_not_found")
  }

  const results = assessment.results as any

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Оценка завершена!</CardTitle>
          <CardDescription>Вот ваши результаты по тесту "{assessment.title}"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{results.level} уровень</h3>
            <div className="relative h-24 w-24 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${results.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{results.score}%</span>
              </div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">{results.description}</p>
          </div>

          <Card className="bg-blue-50 border-blue-200 text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(results.recommendations as string[]).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Link href="/goals" className="flex-1">
              <Button className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Создать цель на основе результатов
              </Button>
            </Link>
            <Link href="/assessments" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                К списку оценок
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
