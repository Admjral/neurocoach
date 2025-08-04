-- Удаляем старые политики для assessments, если они существуют
DROP POLICY IF EXISTS "Users can manage own assessments" ON public.assessments;

-- Создаем более детальные политики для assessments
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.assessments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON public.assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Проверяем, что все политики применены корректно
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'assessments';
