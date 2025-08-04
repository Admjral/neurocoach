"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Target } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface GoalFormProps {
  onSubmit: (goal: any) => void
  onCancel: () => void
}

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [priority, setPriority] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const goalData = {
      title,
      description,
      category,
      deadline: deadline?.toISOString(),
      priority,
      progress: 0,
      status: "active",
    }

    try {
      await onSubmit(goalData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Создать новую цель
        </CardTitle>
        <CardDescription>Определите свою цель и план её достижения</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Название цели *</Label>
            <Input
              id="title"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Улучшить концентрацию внимания"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите подробнее, что вы хотите достичь и почему это важно для вас"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emotional">Эмоциональный интеллект</SelectItem>
                  <SelectItem value="focus">Концентрация и внимание</SelectItem>
                  <SelectItem value="stress">Стресс-менеджмент</SelectItem>
                  <SelectItem value="communication">Коммуникация</SelectItem>
                  <SelectItem value="leadership">Лидерство</SelectItem>
                  <SelectItem value="creativity">Креативность</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Приоритет</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Дедлайн</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP", { locale: ru }) : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Создание..." : "Создать цель"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
