"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalDecomposition } from "@/components/goal-decomposition"
import { ProgressAnalysis } from "@/components/progress-analysis"
import { useToast } from "@/components/ui/use-toast"
import type { Goal } from "@/lib/supabase"

interface GoalDetailClientPageProps {
  initialGoal: Goal & { subgoals: Goal[] }
}

export function GoalDetailClientPage({ initialGoal }: GoalDetailClientPageProps) {
  const [goal, setGoal] = useState(initialGoal)
  const [activeTab, setActiveTab] = useState("decomposition")
  const { toast } = useToast()

  const handleSaveDecomposition = async (subGoals: any[]) => {
    try {
      const response = await fetch(`/api/goals/${goal.id}/subgoals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subGoals }),
      })

      if (!response.ok) {
        throw new Error("Failed to save sub-goals")
      }

      const updatedSubGoals = await response.json()
      setGoal((prev) => ({ ...prev, subgoals: updatedSubGoals }))

      toast({
        title: "Подцели сохранены!",
        description: "Ваш план был успешно обновлен.",
      })
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAnalyzeProgress = (goalData: any) => {
    setActiveTab("analysis")
  }

  const handleRecommendation = (recommendation: any) => {
    console.log("Applying recommendation:", recommendation)
    toast({
      title: "Рекомендация применена",
      description: `Действие "${recommendation.title}" добавлено в ваш план.`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decomposition">Декомпозиция</TabsTrigger>
          <TabsTrigger value="analysis">Анализ прогресса</TabsTrigger>
        </TabsList>

        <TabsContent value="decomposition" className="mt-6">
          <GoalDecomposition mainGoal={goal} onSave={handleSaveDecomposition} onAnalyze={handleAnalyzeProgress} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <ProgressAnalysis
            goalData={{ mainGoal: goal, subGoals: goal.subgoals, sessions: [] }}
            onRecommendation={handleRecommendation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
