"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GoalForm } from "@/components/goal-form"
import { useToast } from "@/components/ui/use-toast"
import type { Goal } from "@/lib/supabase"

interface GoalsClientPageProps {
  initialGoals: (Goal & { subgoals: Goal[] })[]
  userId: string
}

export default function GoalsClientPage({ initialGoals, userId }: GoalsClientPageProps) {
  const [goals, setGoals] = useState(initialGoals)
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false)
  const { toast } = useToast()

  const handleGoalCreated = async (goalData: any) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goalData, user_id: userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create goal")
      }

      const { goal: newGoal } = await response.json()
      const goalWithSubgoals = { ...newGoal, subgoals: [] }

      setGoals([goalWithSubgoals, ...goals])
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

  const getCategoryInfo = (category: string | null) => {
    const info = {
      emotional: { label: "Эмоции", color: "bg-red-100 text-red-800" },
      focus: { label: "Фокус", color: "bg-blue-100 text-blue-800" },
      stress: { label: "Стресс", color: "bg-green-100 text-green-800" },
      communication: { label: "Общение", color: "bg-purple-100 text-purple-800" },
      leadership: { label: "Лидерство", color: "bg-yellow-100 text-yellow-800" },
      creativity: { label: "Креатив", color: "bg-orange-100 text-orange-800" },
    }
    return info[category as keyof typeof info] || { label: "Общее", color: "bg-gray-100 text-gray-800" }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ваши цели</h1>
          <p className="text-gray-600">Управляйте своими целями и отслеживайте прогресс</p>
        </div>
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

      {goals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-16">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">У вас пока нет целей</h3>
            <p className="text-gray-500 mb-6">Создайте свою первую цель, чтобы начать путь к успеху.</p>
            <Button onClick={() => setIsGoalFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать первую цель
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryInfo(goal.category).color}>{getCategoryInfo(goal.category).label}</Badge>
                  <Badge variant={goal.status === "completed" ? "default" : "outline"}>
                    {goal.status === "completed" ? "Завершено" : "В процессе"}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                {goal.description && <CardDescription>{goal.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Прогресс</span>
                    <span className="font-medium">{goal.progress || 0}%</span>
                  </div>
                  <Progress value={goal.progress || 0} className="h-2" />
                  {goal.deadline && (
                    <p className="text-xs text-gray-500 pt-2">
                      Дедлайн: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Link href={`/goals/${goal.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Детали
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
