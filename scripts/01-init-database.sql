-- Включаем необходимые расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Создаем таблицу профилей (расширяет auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу целей
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('emotional', 'focus', 'stress', 'communication', 'leadership', 'creativity')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  goal_type TEXT DEFAULT 'main' CHECK (goal_type IN ('main', 'sub')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight > 0 AND weight <= 3.0),
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу коучинговых сессий
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('goal-setting', 'progress-review', 'problem-solving', 'emotional-support')),
  title TEXT NOT NULL,
  goals_discussed UUID[] DEFAULT '{}',
  insights JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  duration_minutes INTEGER DEFAULT 0,
  transcript TEXT,
  ai_analysis JSONB,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Создаем таблицу отслеживания прогресса
CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,
  previous_progress INTEGER DEFAULT 0,
  new_progress INTEGER DEFAULT 0,
  progress_delta INTEGER GENERATED ALWAYS AS (new_progress - previous_progress) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу оценок
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personality', 'cognitive', 'emotional', 'behavioral')),
  questions JSONB NOT NULL,
  answers JSONB,
  score INTEGER,
  results JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу шаблонов оценок (публичная)
CREATE TABLE IF NOT EXISTS public.assessment_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personality', 'cognitive', 'emotional', 'behavioral')),
  questions JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу категорий целей
CREATE TABLE IF NOT EXISTS public.goal_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON public.goals(parent_goal_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON public.goals(category);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON public.coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_type ON public.coaching_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_status ON public.coaching_sessions(status);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_goal_id ON public.progress_tracking(goal_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_session_id ON public.progress_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON public.assessments(type);

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггеры для updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
