"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Send, Clock, Target, Lightbulb, CheckCircle, TrendingUp, Settings, AlertCircle } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { GoalDecomposition } from "./goal-decomposition"
import { ProgressAnalysis } from "./progress-analysis"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface CoachSessionProps {
  userId: string
  sessionType: "goal-setting" | "progress-review" | "problem-solving" | "emotional-support"
  userProfile: any
  currentGoals: any[]
}

export function AICoachSession({ userId, sessionType, userProfile, currentGoals }: CoachSessionProps) {
  const [sessionPhase, setSessionPhase] = useState<"intro" | "exploration" | "action" | "closure">("intro")
  const [sessionInsights, setSessionInsights] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [aiConfigError, setAiConfigError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Мемоизируем начальное сообщение для предотвращения пересоздания
  const initialMessage = useMemo(() => {
    const userName = userProfile?.name || "друг"
    const greetings = {
      "goal-setting": `Привет, ${userName}! 👋\n\nМеня зовут Алекс, и я ваш персональный ИИ коуч. Рад приветствовать вас на сессии по постановке целей!\n\nСегодня мы вместе:\n✨ Определим ваши истинные желания и приоритеты\n🎯 Сформулируем четкие и достижимые цели\n📋 Создадим конкретный план действий\n\nПомните: каждая великая история начинается с одного шага. И сегодня мы сделаем этот шаг вместе!\n\nРасскажите, что привело вас сюда? Какие мечты или задачи крутятся у вас в голове? 🤔`,
      "progress-review": `Добро пожаловать, ${userName}! 🌟\n\nОтлично, что вы здесь! Регулярный анализ прогресса — это признак мудрого человека, который серьезно относится к своему развитию.\n\nНа этой сессии мы:\n📊 Честно оценим ваши достижения\n🔍 Выявим что работает, а что можно улучшить\n🚀 Скорректируем стратегию для еще лучших результатов\n\n${currentGoals.length > 0 ? `Я вижу, у вас есть ${currentGoals.length} активных целей. Это здорово!` : "Давайте начнем с того, над чем вы сейчас работаете."}\n\nКак дела с вашими целями? Что удается легко, а где чувствуете сопротивление? 💭`,
      "problem-solving": `Здравствуйте, ${userName}! 💪\n\nВы пришли в нужное место! Каждая проблема — это замаскированная возможность для роста. И я здесь, чтобы помочь вам это увидеть.\n\nСегодня мы:\n🧩 Разберем ситуацию по частям\n💡 Найдем неочевидные решения\n⚡ Составим четкий план действий\n\nПомните: нет проблем, есть только задачи, которые еще не решены. А любую задачу можно решить, если подойти к ней правильно!\n\nРасскажите, с какой ситуацией вы столкнулись? Что именно вас беспокоит? 🤝`,
      "emotional-support": `Привет, ${userName}! 🤗\n\nСпасибо, что доверились мне. Обращение за поддержкой — это проявление силы, а не слабости. Это показывает, что вы заботитесь о себе.\n\nВ этом безопасном пространстве мы:\n💙 Разберемся с вашими чувствами\n🌱 Найдем внутренние ресурсы\n🧘 Освоим техники для душевного равновесия\n\nПомните: все эмоции временны, даже самые тяжелые. И вы сильнее, чем думаете.\n\nКак вы себя чувствуете прямо сейчас? Что происходит в вашей жизни? Я здесь, чтобы выслушать и поддержать. 💚`,
    }
    return greetings[sessionType] || greetings["goal-setting"]
  }, [sessionType, userProfile?.name, currentGoals.length])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai-coach",
    body: { userId, sessionType, userProfile, currentGoals },
    initialMessages: [{ id: "initial-greeting", role: "assistant", content: initialMessage }],
    onError: async (error) => {
      try {
        const res = await error.response?.json()
        if (res?.code === "MISSING_API_KEY") {
          setAiConfigError(
            "Ключ OpenAI API не настроен. Пожалуйста, попросите администратора добавить переменную окружения OPENAI_API_KEY в настройках проекта Vercel.",
          )
        } else {
          toast({
            title: "Ошибка чата",
            description: "Не удалось получить ответ от коуча. Пожалуйста, проверьте подключение и попробуйте еще раз.",
            variant: "destructive",
          })
        }
      } catch (e) {
        toast({
          title: "Неизвестная ошибка",
          description: "Произошла непредвиденная ошибка.",
          variant: "destructive",
        })
      }
    },
    onFinish: (message) => {
      analyzeCoachResponse(message.content)
      extractInsights(message.content)
    },
  })

  const analyzeCoachResponse = (content: string) => {
    if (content.includes("домашнее задание") || content.includes("до встречи")) setSessionPhase("closure")
    else if (content.includes("попробуй") || content.includes("упражнение") || content.includes("декомпозиция"))
      setSessionPhase("action")
    else if (content.includes("расскажи") || content.includes("как ты")) setSessionPhase("exploration")
  }

  const extractInsights = (content: string) => {
    if (content.includes("важно понимать") || content.includes("ключевой момент")) {
      const insight = content.split(".")[0] + "."
      setSessionInsights((prev) => [...prev.slice(-2), insight])
    }
  }

  const handleGoalDecomposition = (subGoals: any[]) => {
    console.log("Сохраняем подцели:", subGoals)
    setActiveTab("chat")
  }

  const handleProgressAnalysis = (goalData: any) => {
    setSelectedGoal(goalData)
    setActiveTab("analysis")
  }

  const handleRecommendation = (recommendation: any) => {
    console.log("Применяем рекомендацию:", recommendation)
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "intro":
        return <Brain className="h-4 w-4" />
      case "exploration":
        return <Target className="h-4 w-4" />
      case "action":
        return <Lightbulb className="h-4 w-4" />
      case "closure":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "intro":
        return "Знакомство"
      case "exploration":
        return "Исследование"
      case "action":
        return "Действие"
      case "closure":
        return "Завершение"
      default:
        return "Сессия"
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const displayMessages = messages.filter((m) => m.role !== "system")
  const canSubmit = !isLoading && !!input?.trim() && !aiConfigError

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Brain className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Алекс - ваш ИИ коуч
                  <Badge variant="secondary" className="ml-2">
                    {getPhaseIcon(sessionPhase)}
                    {getPhaseLabel(sessionPhase)}
                  </Badge>
                  {aiConfigError && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Ошибка
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Сессия: {sessionType === "goal-setting" && "Постановка целей"}
                  {sessionType === "progress-review" && "Обзор прогресса"}
                  {sessionType === "problem-solving" && "Решение проблем"}
                  {sessionType === "emotional-support" && "Эмоциональная поддержка"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {aiConfigError && (
        <Card className="mb-6 border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-yellow-900">
              <AlertCircle className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold">Требуется настройка ИИ-коуча</h3>
                <p className="text-sm">{aiConfigError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Диалог с коучем</TabsTrigger>
          <TabsTrigger value="decomposition">Декомпозиция целей</TabsTrigger>
          <TabsTrigger value="analysis">Анализ прогресса</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Диалог с коучем</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                    <motion.div layout className="space-y-4">
                      {displayMessages.map((message, i) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                <Brain className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {new Date(message.createdAt || Date.now()).toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                {userProfile?.name?.[0] || "У"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 justify-start"
                        >
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              <Brain className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg px-4 py-2 border flex items-center gap-2">
                            <span className="text-sm text-gray-500">Алекс печатает</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </ScrollArea>

                  <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={aiConfigError ? "ИИ-коуч не настроен" : "Напишите ваш ответ..."}
                      className="flex-1"
                      disabled={isLoading || !!aiConfigError}
                    />
                    <Button type="submit" disabled={!canSubmit}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Прогресс сессии</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["intro", "exploration", "action", "closure"].map((phase, index) => (
                    <div key={phase} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          sessionPhase === phase
                            ? "bg-blue-600"
                            : index < ["intro", "exploration", "action", "closure"].indexOf(sessionPhase)
                              ? "bg-green-600"
                              : "bg-gray-200"
                        }`}
                      />
                      <span className="text-sm">{getPhaseLabel(phase)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {currentGoals.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Ваши цели</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentGoals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="text-sm">
                        <div className="font-medium">{goal.title}</div>
                        <div className="text-gray-500 text-xs">{goal.progress}% завершено</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {sessionInsights.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Инсайты сессии</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sessionInsights.map((insight, index) => (
                      <div key={index} className="text-sm p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                        {insight}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Инструменты коуча</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs bg-transparent"
                    onClick={() => setActiveTab("decomposition")}
                  >
                    <Target className="h-3 w-3 mr-2" />
                    Декомпозиция целей
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs bg-transparent"
                    onClick={() => setActiveTab("analysis")}
                  >
                    <TrendingUp className="h-3 w-3 mr-2" />
                    Анализ прогресса
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
                    <Settings className="h-3 w-3 mr-2" />
                    Настройки сессии
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decomposition" className="mt-6">
          {currentGoals.length > 0 ? (
            <GoalDecomposition
              mainGoal={currentGoals[0]}
              onSave={handleGoalDecomposition}
              onAnalyze={handleProgressAnalysis}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Нет активных целей</h3>
                <p className="text-gray-600 mb-4">Создайте цель, чтобы использовать декомпозицию</p>
                <Button>Создать цель</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          {selectedGoal ? (
            <ProgressAnalysis goalData={selectedGoal} onRecommendation={handleRecommendation} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Выберите цель для анализа</h3>
                <p className="text-gray-600 mb-4">Перейдите в декомпозицию и нажмите "Анализ прогресса"</p>
                <Button onClick={() => setActiveTab("decomposition")}>Перейти к декомпозиции</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
