"use client"

import { memo } from "react"
import { AICoachSession } from "@/components/ai-coach-session"
import type { Profile, Goal } from "@/lib/supabase"

interface CoachSessionClientProps {
  userId: string
  sessionType: "goal-setting" | "progress-review" | "problem-solving" | "emotional-support"
  userProfile: Profile | null
  currentGoals: Goal[]
}

function CoachSessionClientComponent({ userId, sessionType, userProfile, currentGoals }: CoachSessionClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AICoachSession userId={userId} sessionType={sessionType} userProfile={userProfile} currentGoals={currentGoals} />
    </div>
  )
}

export const CoachSessionClient = memo(CoachSessionClientComponent)
