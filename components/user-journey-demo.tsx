"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, TrendingUp, CheckCircle, Plus, ArrowRight } from "lucide-react"

export function UserJourneyDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userGoals, setUserGoals] = useState<any[]>([])
  const [userStats, setUserStats] = useState({
    activeGoals: 0,
    completedSessions: 0,
    averageProgress: 0,
    streakDays: 0,
  })

  const steps = [
    {
      title: "Добро пожаловать!",
      description: "Пользователь впервые заходит в дашборд",
      action: "Начать путешествие",
    },
    {
      title: "Создание первой цели",
      description: "Пользователь добавляет свою первую цель",
      action: "Создать цель",
    },
    {
      title: "Прохождение оценки",
      description: "Пользователь проходит тест на эмоциональный интеллект",
      action: "Пройти тест",
    },
    {
      title: "Отслеживание прогресса",
      description: "Пользователь обновляет прогресс своей цели",
      action: "Обновить прогресс",
    },
    {
      title: "Достижение результата",
      description: "Пользователь видит свой рост и достижения",
      action: "Посмотреть результаты",
    },
  ]

  const handleStepAction = () => {
    switch (currentStep) {
      case 0:
        // Пользователь входит в систему
        setCurrentStep(1)
        break
      case 1:
        // Создание первой цели
        const newGoal = {
          id: 1,
          title: "Улучшить концентрацию",
          progress: 0,
          category: "focus",
          deadline: "2024-02-15",
        }
        setUserGoals([newGoal])
        setUserStats((prev) => ({ ...prev, activeGoals: 1 }))
        setCurrentStep(2)
        break
      case 2:
        // Прохождение оценки
        setUserStats((prev) => ({ ...prev, completedSessions: 1 }))
        setCurrentStep(3)
        break
      case 3:
        // Обновление прогресса
        setUserGoals((prev) => prev.map((goal) => ({ ...goal, progress: 75 })))
        setUserStats((prev) => ({
          ...prev,
          averageProgress: 75,
          streakDays: 7,
          completedSessions: 3,
        }))
        setCurrentStep(4)
        break
      case 4:
        // Показать финальные результаты
        setUserGoals((prev) => prev.map((goal) => ({ ...goal, progress: 100, status: "completed" })))
        setUserStats((prev) => ({
          ...prev,
          averageProgress: 100,
          streakDays: 15,
          completedSessions: 8,
        }))
        break
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setUserGoals([])
    setUserStats({
      activeGoals: 0,
      completedSessions: 0,
      averageProgress: 0,
      streakDays: 0,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Как работает платформа</h2>
        <p className="text-gray-600">Интерактивная демонстрация пользовательского пути</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Шаг {currentStep + 1}: {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStepAction} className="mr-4">
            {steps[currentStep].action}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {currentStep > 0 && (
            <Button variant="outline" onClick={resetDemo} className="bg-transparent">
              Начать сначала
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Preview */}
      {currentStep > 0 && (
        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные цели</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.activeGoals}</div>
              <p className="text-xs text-muted-foreground">
                {currentStep > 1 ? "+1 за эту неделю" : "Создайте первую цель"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершенные сессии</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.completedSessions}</div>
              <p className="text-xs text-muted-foreground">
                {currentStep > 2 ? "Отличный прогресс!" : "Пройдите первую оценку"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний прогресс</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.averageProgress}%</div>
              <p className="text-xs text-muted-foreground">
                {currentStep > 3 ? "+25% за неделю" : "Начните работать над целями"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дни подряд</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.streakDays}</div>
              <p className="text-xs text-muted-foreground">
                {currentStep > 3 ? "Отличная работа!" : "Поддерживайте активность"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals List */}
      {userGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ваши цели
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <div className="flex items-center gap-2">
                    {goal.progress === 100 && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Завершено!
                      </Badge>
                    )}
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-gray-500">Дедлайн: {goal.deadline}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {currentStep === 4 && userStats.averageProgress === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">Поздравляем с достижением цели!</h3>
              <p className="text-green-700 mb-4">
                Вы успешно прошли путь от постановки цели до её достижения. Ваш прогресс в концентрации внимания
                значительно улучшился!
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Поставить новую цель
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Поделиться успехом
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
