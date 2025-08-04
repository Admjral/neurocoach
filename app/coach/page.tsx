"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, TrendingUp, Heart, MessageCircle, Clock, Users, Zap } from "lucide-react"

export default function CoachPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const sessionTypes = [
    {
      id: "goal-setting",
      title: "Постановка целей",
      description: "Определите четкие, достижимые цели и создайте план их реализации",
      icon: <Target className="h-8 w-8" />,
      color: "blue",
      duration: "30-45 мин",
      techniques: ["SMART цели", "Визуализация", "Планирование"],
      bestFor: "Когда нужно структурировать планы и определить приоритеты",
    },
    {
      id: "progress-review",
      title: "Обзор прогресса",
      description: "Проанализируйте достижения, выявите препятствия и скорректируйте стратегию",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "green",
      duration: "25-35 мин",
      techniques: ["Рефлексия", "Анализ препятствий", "Корректировка планов"],
      bestFor: "Для регулярного отслеживания прогресса по целям",
    },
    {
      id: "problem-solving",
      title: "Решение проблем",
      description: "Найдите эффективные решения для текущих вызовов и препятствий",
      icon: <Zap className="h-8 w-8" />,
      color: "orange",
      duration: "35-50 мин",
      techniques: ["Мозговой штурм", "Анализ причин", "План действий"],
      bestFor: "Когда сталкиваетесь с конкретными проблемами или препятствиями",
    },
    {
      id: "emotional-support",
      title: "Эмоциональная поддержка",
      description: "Работа со стрессом, тревожностью и эмоциональными блоками",
      icon: <Heart className="h-8 w-8" />,
      color: "pink",
      duration: "40-60 мин",
      techniques: ["Техники релаксации", "Эмоциональная регуляция", "Майндфулнесс"],
      bestFor: "При стрессе, тревожности или эмоциональных трудностях",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      green: "text-green-600 bg-green-50 border-green-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
      pink: "text-pink-600 bg-pink-50 border-pink-200",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Встреча с ИИ коучем Алексом</h1>
            <p className="text-gray-600">
              Выберите тип сессии, который лучше всего подходит вашим текущим потребностям
            </p>
          </div>
        </div>
      </div>

      {/* Session Types */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {sessionTypes.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedSession === session.id ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
            onClick={() => setSelectedSession(session.id)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getColorClasses(session.color)}`}>{session.icon}</div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 mb-2">
                    {session.title}
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.duration}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{session.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Техники:</h4>
                  <div className="flex flex-wrap gap-1">
                    {session.techniques.map((technique) => (
                      <Badge key={technique} variant="secondary" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Лучше всего подходит:</h4>
                  <p className="text-sm text-gray-600">{session.bestFor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      {selectedSession && (
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Готовы начать сессию?</h3>
                <p className="text-sm text-gray-600">
                  Вы выбрали: {sessionTypes.find((s) => s.id === selectedSession)?.title}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/coach/session?type=${selectedSession}`} className="flex-1">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Начать сессию
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setSelectedSession(null)} className="bg-transparent">
                  Изменить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coach Info */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Познакомьтесь с Алексом</h3>
              <p className="text-gray-600">Ваш персональный ИИ коуч</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Опыт работы</h4>
              <p className="text-sm text-gray-600">Обучен на тысячах сессий коучинга и научных исследованиях</p>
            </div>
            <div className="text-center">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Научный подход</h4>
              <p className="text-sm text-gray-600">Использует проверенные методики CBT, NLP и позитивной психологии</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Персональный подход</h4>
              <p className="text-sm text-gray-600">Адаптируется под ваш стиль общения и личные потребности</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
