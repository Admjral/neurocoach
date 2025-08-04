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
import type { Goal } from "@/lib/supabase"

interface DashboardClientPageProps {
  initialGoals: (Goal & { subgoals: Goal[] })[]
  initialStats: {
    activeGoals: number
    completedSessions: number
    averageProgress: number
    streakDays: number
  }
  userId: string
}

const DashboardClientPage = ({ initialGoals, initialStats, userId }: DashboardClientPageProps) => {
  const [goals, setGoals] = useState(initialGoals)
  const [stats, setStats] = useState(initialStats)
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false)
  const { toast } = useToast()

  const handleGoalCreated = async (goalData: any) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...goalData, user_id: userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create goal")
      }

      const { goal: newGoal } = await response.json()

      const goalWithSubgoals = { ...newGoal, subgoals: [] }

      setGoals([goalWithSubgoals, ...goals])
      setStats((prev) => ({ ...prev, activeGoals: prev.activeGoals + 1 }))
      toast({
        title: "Цель создана!",
        description: "Ваша новая цель была успешно добавлена.",
      })
      setIsGoalFormOpen(false)
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать цель. Попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ваш дашборд</h1>
        <p className="text-gray-600">Вот ваш прогресс на сегодня</p>
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
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Пока нет целей</h3>
                  <p className="text-gray-600 mb-4">Создайте свою первую цель, чтобы начать путь к успеху</p>
                  <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Создать цель
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создать новую цель</DialogTitle>
                      </DialogHeader>
                      <GoalForm onSubmit={handleGoalCreated} onCancel={() => setIsGoalFormOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                goals.map((goal) => (
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
                ))
              )}
              {goals.length > 0 && (
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
              )}
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
              <Link href="/coach">
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
        </div>
      </div>
    </>
  )
}

export default DashboardClientPage
