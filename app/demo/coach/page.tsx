"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

const demoResponses = [
  "Отличный вопрос! 🤔 Давайте разберем это вместе. Что именно вас больше всего беспокоит в этой ситуации?",
  "Я понимаю ваши чувства. 💙 Это совершенно нормально - чувствовать себя так в подобных обстоятельствах. Расскажите больше о том, что происходит.",
  "Замечательно! 🌟 Вы уже делаете важные шаги. Какие результаты вы заметили от своих усилий?",
  "Интересная мысль! 💡 А что, если мы попробуем посмотреть на это с другой стороны? Какие возможности вы видите в этой ситуации?",
  "Понимаю, это может быть сложно. 🤝 Давайте найдем практические шаги, которые помогут вам двигаться вперед. Что бы вы хотели изменить в первую очередь?",
]

export default function DemoCoachPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant" as const,
      content:
        "Привет! 👋 Меня зовут Алекс, и я ваш демо ИИ коуч. Я здесь, чтобы помочь вам в личностном развитии.\n\nЭто демо-версия, поэтому мои ответы ограничены, но вы можете почувствовать, как работает настоящая платформа!\n\nРасскажите, что вас беспокоит или над чем вы хотели бы поработать? 🤔",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Симулируем задержку ответа
    setTimeout(() => {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: randomResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">NeuroCoach</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            ДЕМО РЕЖИМ
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Coach Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Brain className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Алекс - ваш демо ИИ коуч
                  <Badge variant="secondary">
                    <Brain className="h-4 w-4 mr-1" />
                    Демо сессия
                  </Badge>
                </CardTitle>
                <CardDescription>Попробуйте пообщаться с ИИ коучем в демо-режиме</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Диалог с коучем
              <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                <Clock className="h-4 w-4" />
                {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                        {message.timestamp.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">У</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
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
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите ваш ответ..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium mb-2">Демо режим</h3>
              <p className="text-sm text-gray-600 mb-4">
                Это демо-версия ИИ коуча. В полной версии коуч использует продвинутые алгоритмы и помнит контекст всех
                ваших сессий.
              </p>
              <Link href="/auth/signup">
                <Button>Получить полный доступ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
