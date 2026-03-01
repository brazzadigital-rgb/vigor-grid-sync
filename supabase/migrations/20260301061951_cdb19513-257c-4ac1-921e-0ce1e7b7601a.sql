
-- Onboarding data (one row per user)
CREATE TABLE public.onboarding_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  gender text,
  age integer,
  height integer,
  weight integer,
  activity_level text,
  fitness_goal text,
  experience_level text,
  equipment text[],
  workout_duration text,
  workout_location text,
  preferred_time text,
  injuries text[],
  reminders text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own onboarding" ON public.onboarding_data FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own onboarding" ON public.onboarding_data FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own onboarding" ON public.onboarding_data FOR UPDATE USING (user_id = auth.uid());

CREATE TRIGGER update_onboarding_data_updated_at
  BEFORE UPDATE ON public.onboarding_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- User goals
CREATE TABLE public.user_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  target_value numeric,
  current_value numeric DEFAULT 0,
  unit text,
  status text NOT NULL DEFAULT 'active',
  deadline date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own goals" ON public.user_goals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own goals" ON public.user_goals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own goals" ON public.user_goals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users delete own goals" ON public.user_goals FOR DELETE USING (user_id = auth.uid());

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
