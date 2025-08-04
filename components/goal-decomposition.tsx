"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, Trash2, Calendar, Weight, ArrowRight, CheckCircle, Brain, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

interface SubGoal {
  id: string
  title: string
  description: string
  progress: number
  weight: number
  deadline?: string
  status: "not_started" | "in_progress" | "completed"
  orderIndex: number
}

interface GoalDecompositionProps {
  mainGoal: {
    id: string
    title: string
    description: string
    progress: number
  }
  onSave: (subGoals: SubGoal[]) => void
  onAnalyze: (goalData: any) => void
}

export function GoalDecomposition({ mainGoal, onSave, onAnalyze }: GoalDecompositionProps) {
  const [subGoals, setSubGoals] = useState<SubGoal[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [newSubGoal, setNewSubGoal] = useState({
    title: "",
    description: "",
    weight: 1,
    deadline: "",
  })
  const { toast } = useToast()

  // Автоматическая декомпозиция с помощью ИИ
  const handleAIDecomposition = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai-goal-decomposition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainGoal: mainGoal,
          context: "Пользователь хочет разбить свою цель на более мелкие, достижимые подцели",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Произошла ошибка на сервере.")
      }

      if (data.subGoals) {
        setSubGoals(data.subGoals)
        setAiSuggestions(data.suggestions || [])
        toast({
          title: "Декомпозиция завершена!",
          description: "ИИ коуч предложил план для вашей цели.",
        })
      } else {
        throw new Error("Получен некорректный ответ от сервера.")
      }
    } catch (error: any) {
      console.error("Ошибка декомпозиции:", error)
      toast({
        title: "Ошибка декомпозиции",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addSubGoal = () => {
    if (!newSubGoal.title.trim()) return

    const subGoal: SubGoal = {
      id: `sub-${Date.now()}`,
      title: newSubGoal.title,
      description: newSubGoal.description,
      progress: 0,
      weight: newSubGoal.weight,
      deadline: newSubGoal.deadline || undefined,
      status: "not_started",
      orderIndex: subGoals.length,
    }

    setSubGoals([...subGoals, subGoal])
    setNewSubGoal({
      title: "",
      description: "",
      weight: 1,
      deadline: "",
    })
  }

  const removeSubGoal = (id: string) => {
    setSubGoals(subGoals.filter((sg) => sg.id !== id))
  }

  const updateSubGoalProgress = (id: string, progress: number) => {
    setSubGoals(
      subGoals.map((sg) =>
        sg.id === id
          ? {
              ...sg,
              progress,
              status: progress === 0 ? "not_started" : progress === 100 ? "completed" : "in_progress",
            }
          : sg,
      ),
    )
  }

  // Расчет общего прогресса на основе весов подцелей
  const calculateOverallProgress = () => {
    if (subGoals.length === 0) return mainGoal.progress

    const totalWeight = subGoals.reduce((sum, sg) => sum + sg.weight, 0)
    const weightedProgress = subGoals.reduce((sum, sg) => sum + sg.progress * sg.weight, 0)

    return Math.round(weightedProgress / totalWeight)
  }

  const getStatusColor = (status: SubGoal["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "not_started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: SubGoal["status"]) => {
    switch (status) {
      case "completed":
        return "Завершено"
      case "in_progress":
        return "В процессе"
      case "not_started":
        return "Не начато"
      default:
        return "Не начато"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Goal Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Декомпозиция цели: {mainGoal.title}
          </CardTitle>
          <CardDescription>Разбейте вашу большую цель на более мелкие, достижимые подцели</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Общий прогресс</span>
                <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3" />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAIDecomposition} disabled={isAnalyzing} className="flex-1">
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Анализирую..." : "ИИ декомпозиция"}
              </Button>
              <Button variant="outline" onClick={() => onAnalyze({ mainGoal, subGoals })} className="bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Анализ прогресса
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Рекомендации ИИ коуча
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sub Goals List */}
      {subGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Подцели ({subGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subGoals.map((subGoal, index) => (
              <div key={subGoal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {index + 1}. {subGoal.title}
                      </span>
                      <Badge className={getStatusColor(subGoal.status)}>{getStatusLabel(subGoal.status)}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Weight className="h-3 w-3 mr-1" />
                        Вес: {subGoal.weight}
                      </Badge>
                    </div>
                    {subGoal.description && <p className="text-sm text-gray-600 mb-2">{subGoal.description}</p>}
                    {subGoal.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        Дедлайн: {subGoal.deadline}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubGoal(subGoal.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`progress-${subGoal.id}`} className="text-sm">
                      Прогресс
                    </Label>
                    <span className="text-sm font-medium">{subGoal.progress}%</span>
                  </div>
                  <Slider
                    id={`progress-${subGoal.id}`}
                    min={0}
                    max={100}
                    step={1}
                    value={[subGoal.progress]}
                    onValueChange={(value) => updateSubGoalProgress(subGoal.id, value[0])}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Sub Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Добавить подцель
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subgoal-title">Название подцели *</Label>
              <Input
                id="subgoal-title"
                value={newSubGoal.title || ""}
                onChange={(e) => setNewSubGoal({ ...newSubGoal, title: e.target.value })}
                placeholder="Например: Изучить основы медитации"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subgoal-deadline">Дедлайн</Label>
              <Input
                id="subgoal-deadline"
                type="date"
                value={newSubGoal.deadline || ""}
                onChange={(e) => setNewSubGoal({ ...newSubGoal, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subgoal-description">Описание</Label>
            <Textarea
              id="subgoal-description"
              value={newSubGoal.description || ""}
              onChange={(e) => setNewSubGoal({ ...newSubGoal, description: e.target.value })}
              placeholder="Подробное описание того, что нужно сделать"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subgoal-weight">Вес в общем прогрессе: {newSubGoal.weight}</Label>
            <Slider
              id="subgoal-weight"
              min={0.1}
              max={3}
              step={0.1}
              value={[newSubGoal.weight]}
              onValueChange={(value) => setNewSubGoal({ ...newSubGoal, weight: value[0] })}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Низкий приоритет</span>
              <span>Высокий приоритет</span>
            </div>
          </div>

          <Button onClick={addSubGoal} disabled={!newSubGoal.title.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить подцель
          </Button>
        </CardContent>
      </Card>

      {/* Save Actions */}
      {subGoals.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button onClick={() => onSave(subGoals)} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Сохранить декомпозицию
              </Button>
              <Button variant="outline" className="bg-transparent">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
