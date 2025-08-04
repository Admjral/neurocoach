"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, Calendar, TrendingUp, BookOpen, Plus, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GoalForm } from "@/components/goal-form"
import { useToast } from "@/components/ui/use-toast"

// Демо данные
const demoGoals = [
  {
    id: "1",
    title: "Улучшить концентрацию внимания",
    description: "Развить способность фокусироваться на задачах без отвлечений",
    progress: 65,
    status: "active",
    category: "focus",
    deadline: "2024-03-15",
    subgoals: [],
  },
  {
    id: "2",
    title: "Развить эмоциональный интеллект",
    description: "Научиться лучше понимать и управлять своими эмоциями",
    progress: 30,
    status: "active",
    category: "emotional",
    deadline: "2024-04-01",
    subgoals: [],
  },
]

const demoStats = {
  activeGoals: 2,
  completedSessions: 5,
  averageProgress: 47,
  streakDays: 7,
}

export default function DemoPage() {
  const [goals, setGoals] = useState(demoGoals)
  const [stats, setStats] = useState(demoStats)
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false)
  const { toast } = useToast()

  const handleGoalCreated = async (goalData: any) => {
    try {
      const newGoal = {
        ...goalData,
        id: `demo-${Date.now()}`,
        progress: 0,
        status: "active",
        subgoals: [],
      }

      setGoals([newGoal, ...goals])
      setStats((prev) => ({ ...prev, activeGoals: prev.activeGoals + 1 }))

      toast({
        title: "Цель создана!",
        description: "Ваша новая цель была успешно добавлена в демо-режиме.",
      })
      setIsGoalFormOpen(false)
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать цель.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NeuroCoach</span>
          </Link>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            ДЕМО РЕЖИМ
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Демо дашборд</h1>
          <p className="text-gray-600">Попробуйте все возможности платформы в демо-режиме</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные цели</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGoals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершенные сессии</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний прогресс</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дни подряд</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streakDays}</div>
              <p className="text-xs text-muted-foreground">Отличная работа!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Активные цели
                </CardTitle>
                <CardDescription>Ваш текущий прогресс по целям</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{goal.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={goal.status === "completed" ? "default" : "outline"}>
                          {goal.status === "completed" ? "Завершено" : "В процессе"}
                        </Badge>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                    {goal.deadline && (
                      <p className="text-sm text-gray-500">Дедлайн: {new Date(goal.deadline).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
                <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить новую цель
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать новую цель</DialogTitle>
                    </DialogHeader>
                    <GoalForm onSubmit={handleGoalCreated} onCancel={() => setIsGoalFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Быстрые действия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/demo/coach">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Brain className="h-4 w-4 mr-2" />
                    Сессия с ИИ коучем
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Пройти оценку
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Посмотреть аналитику
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium mb-2">Демо режим</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Вы используете демо-версию. Данные не сохраняются между сессиями.
                  </p>
                  <Link href="/auth/signup">
                    <Button size="sm">Создать аккаунт</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
