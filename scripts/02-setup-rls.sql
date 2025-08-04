-- Включаем Row Level Security для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_categories ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Политики для goals
CREATE POLICY "Users can manage own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

-- Политики для coaching_sessions
CREATE POLICY "Users can manage own coaching sessions" ON public.coaching_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Политики для progress_tracking
CREATE POLICY "Users can manage own progress tracking" ON public.progress_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Политики для assessments (ИСПРАВЛЕНО)
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.assessments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON public.assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для assessment_templates (публичные для чтения)
CREATE POLICY "Assessment templates are viewable by everyone" ON public.assessment_templates
  FOR SELECT USING (is_active = true);

-- Политики для goal_categories (публичные для чтения)
CREATE POLICY "Goal categories are viewable by everyone" ON public.goal_categories
  FOR SELECT USING (is_active = true);
