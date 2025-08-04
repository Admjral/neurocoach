import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wlmloslwccxencrbwlil.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbWxvc2x3Y2N4ZW5jcmJ3bGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTgwNTgsImV4cCI6MjA2OTgzNDA1OH0.duY0FsJyv1vjKf-KXLKgHhN0A6oe-we45o2v8oX5FnE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для нашей базы данных
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          bio: string | null
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
        }
        Update: {
          name?: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          parent_goal_id: string | null
          title: string
          description: string | null
          category: "emotional" | "focus" | "stress" | "communication" | "leadership" | "creativity" | null
          priority: "high" | "medium" | "low"
          goal_type: "main" | "sub"
          progress: number
          weight: number
          order_index: number
          status: "active" | "completed" | "paused" | "cancelled"
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          parent_goal_id?: string | null
          title: string
          description?: string | null
          category?: "emotional" | "focus" | "stress" | "communication" | "leadership" | "creativity" | null
          priority?: "high" | "medium" | "low"
          goal_type?: "main" | "sub"
          progress?: number
          weight?: number
          order_index?: number
          status?: "active" | "completed" | "paused" | "cancelled"
          deadline?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          category?: "emotional" | "focus" | "stress" | "communication" | "leadership" | "creativity" | null
          priority?: "high" | "medium" | "low"
          progress?: number
          weight?: number
          order_index?: number
          status?: "active" | "completed" | "paused" | "cancelled"
          deadline?: string | null
        }
      }
      coaching_sessions: {
        Row: {
          id: string
          user_id: string
          session_type: "goal-setting" | "progress-review" | "problem-solving" | "emotional-support"
          title: string
          goals_discussed: string[]
          insights: any[]
          action_items: any[]
          mood_before: number | null
          mood_after: number | null
          session_rating: number | null
          duration_minutes: number
          transcript: string | null
          ai_analysis: any | null
          status: "scheduled" | "in_progress" | "completed" | "cancelled"
          created_at: string
          completed_at: string | null
        }
        Insert: {
          user_id: string
          session_type: "goal-setting" | "progress-review" | "problem-solving" | "emotional-support"
          title: string
          goals_discussed?: string[]
          insights?: any[]
          action_items?: any[]
          mood_before?: number | null
          mood_after?: number | null
          session_rating?: number | null
          duration_minutes?: number
          transcript?: string | null
          ai_analysis?: any | null
          status?: "scheduled" | "in_progress" | "completed" | "cancelled"
          completed_at?: string | null
        }
        Update: {
          title?: string
          goals_discussed?: string[]
          insights?: any[]
          action_items?: any[]
          mood_before?: number | null
          mood_after?: number | null
          session_rating?: number | null
          duration_minutes?: number
          transcript?: string | null
          ai_analysis?: any | null
          status?: "scheduled" | "in_progress" | "completed" | "cancelled"
          completed_at?: string | null
        }
      }
      progress_tracking: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          session_id: string | null
          previous_progress: number
          new_progress: number
          progress_delta: number
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          goal_id: string
          session_id?: string | null
          previous_progress?: number
          new_progress?: number
          notes?: string | null
        }
        Update: {
          notes?: string | null
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          title: string
          type: "personality" | "cognitive" | "emotional" | "behavioral"
          questions: any
          answers: any | null
          score: number | null
          results: any | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          type: "personality" | "cognitive" | "emotional" | "behavioral"
          questions: any
          answers?: any | null
          score?: number | null
          results?: any | null
          completed_at?: string | null
        }
        Update: {
          answers?: any | null
          score?: number | null
          results?: any | null
          completed_at?: string | null
        }
      }
      assessment_templates: {
        Row: {
          id: string
          title: string
          type: "personality" | "cognitive" | "emotional" | "behavioral"
          questions: any
          description: string | null
          is_active: boolean
          created_at: string
        }
      }
      goal_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          is_active: boolean
        }
      }
    }
  }
}

// Создаем типизированный клиент
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Вспомогательные типы
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Goal = Database["public"]["Tables"]["goals"]["Row"]
export type CoachingSession = Database["public"]["Tables"]["coaching_sessions"]["Row"]
export type ProgressTracking = Database["public"]["Tables"]["progress_tracking"]["Row"]
export type Assessment = Database["public"]["Tables"]["assessments"]["Row"]
export type AssessmentTemplate = Database["public"]["Tables"]["assessment_templates"]["Row"]
export type GoalCategory = Database["public"]["Tables"]["goal_categories"]["Row"]
