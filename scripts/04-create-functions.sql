-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'Пользователь')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Функция для расчета общего прогресса цели на основе подцелей
CREATE OR REPLACE FUNCTION public.calculate_goal_progress(goal_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_weight DECIMAL := 0;
  weighted_progress DECIMAL := 0;
  sub_goal RECORD;
BEGIN
  -- Получаем все подцели
  FOR sub_goal IN 
    SELECT progress, weight 
    FROM public.goals 
    WHERE parent_goal_id = goal_id AND goal_type = 'sub'
  LOOP
    total_weight := total_weight + sub_goal.weight;
    weighted_progress := weighted_progress + (sub_goal.progress * sub_goal.weight);
  END LOOP;
  
  -- Если нет подцелей, возвращаем текущий прогресс
  IF total_weight = 0 THEN
    RETURN (SELECT progress FROM public.goals WHERE id = goal_id);
  END IF;
  
  -- Возвращаем взвешенный прогресс
  RETURN ROUND(weighted_progress / total_weight);
END;
$$ LANGUAGE plpgsql;

-- Функция для обновления прогресса родительской цели
CREATE OR REPLACE FUNCTION public.update_parent_goal_progress()
RETURNS trigger AS $$
BEGIN
  -- Обновляем прогресс родительской цели, если она существует
  IF NEW.parent_goal_id IS NOT NULL THEN
    UPDATE public.goals 
    SET progress = public.calculate_goal_progress(NEW.parent_goal_id)
    WHERE id = NEW.parent_goal_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления прогресса родительской цели
CREATE TRIGGER update_parent_progress_trigger
  AFTER UPDATE OF progress ON public.goals
  FOR EACH ROW 
  WHEN (NEW.goal_type = 'sub' AND NEW.parent_goal_id IS NOT NULL)
  EXECUTE FUNCTION public.update_parent_goal_progress();

-- Функция для создания записи в progress_tracking
CREATE OR REPLACE FUNCTION public.track_progress_change()
RETURNS trigger AS $$
BEGIN
  -- Создаем запись об изменении прогресса
  IF OLD.progress != NEW.progress THEN
    INSERT INTO public.progress_tracking (
      user_id, 
      goal_id, 
      previous_progress, 
      new_progress,
      notes
    ) VALUES (
      NEW.user_id,
      NEW.id,
      OLD.progress,
      NEW.progress,
      'Автоматическое обновление прогресса'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для отслеживания изменений прогресса
CREATE TRIGGER track_goal_progress_trigger
  AFTER UPDATE OF progress ON public.goals
  FOR EACH ROW 
  EXECUTE FUNCTION public.track_progress_change();
