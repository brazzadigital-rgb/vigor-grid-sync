-- ============================================================
-- GYM SaaS White-Label — SQL COMPLETO PARA SUPABASE PRO
-- Gerado em: 2026-03-18
-- 
-- INSTRUÇÕES:
-- 1. Crie um novo projeto no Supabase
-- 2. Vá em SQL Editor
-- 3. Cole e execute este arquivo inteiro
-- 4. Crie os Storage Buckets (seção no final)
-- ============================================================

-- ============================================
-- 1. ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'owner', 'coach', 'member');
CREATE TYPE public.goal_type AS ENUM ('hipertrofia', 'emagrecimento', 'performance', 'reabilitacao', 'outro');
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'semiannual', 'annual', 'one_time');
CREATE TYPE public.membership_status AS ENUM ('active', 'paused', 'cancelled', 'expired');
CREATE TYPE public.subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'failed', 'refunded');
CREATE TYPE public.workout_session_status AS ENUM ('planned', 'done', 'missed');
CREATE TYPE public.credential_type AS ENUM ('qr', 'rfid', 'pin');
CREATE TYPE public.credential_status AS ENUM ('active', 'blocked', 'expired');
CREATE TYPE public.access_decision AS ENUM ('allow', 'deny');
CREATE TYPE public.device_type AS ENUM ('henry_turnstile', 'generic');
CREATE TYPE public.ai_job_status AS ENUM ('pending', 'running', 'done', 'error');
CREATE TYPE public.progress_type AS ENUM ('weight', 'bodyfat', 'measurements');
CREATE TYPE public.notification_type AS ENUM (
  'payment_paid', 'payment_failed', 'plan_expiring', 'plan_activated',
  'promotion', 'order_paid', 'new_workout', 'coach_message'
);

-- ============================================
-- 2. TABLES
-- ============================================

-- Gyms
CREATE TABLE public.gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  accent_color TEXT DEFAULT '#7148EC',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles (separate table per security guidelines)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, gym_id, role)
);

-- Plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal_type goal_type NOT NULL DEFAULT 'outro',
  duration_weeks INT,
  level TEXT,
  benefits JSONB DEFAULT '[]',
  price_cents INT NOT NULL DEFAULT 0,
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  active BOOLEAN DEFAULT true,
  personal_trainer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Memberships
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  status membership_status NOT NULL DEFAULT 'active',
  start_at TIMESTAMPTZ DEFAULT now(),
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  provider TEXT,
  provider_subscription_id TEXT,
  status subscription_status NOT NULL DEFAULT 'active',
  next_billing_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  provider TEXT,
  provider_payment_id TEXT,
  amount_cents INT NOT NULL DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  raw JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exercises
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  equipment TEXT,
  muscle_group TEXT,
  instructions TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Templates
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  goal_type goal_type DEFAULT 'outro',
  level TEXT,
  weeks INT DEFAULT 4,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Days
CREATE TABLE public.workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  day_index INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Items
CREATE TABLE public.workout_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id UUID REFERENCES public.workout_days(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  sets INT DEFAULT 3,
  reps TEXT DEFAULT '12',
  rest_seconds INT DEFAULT 60,
  intensity TEXT,
  order_index INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assigned Workouts
CREATE TABLE public.assigned_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Sessions
CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_workout_id UUID REFERENCES public.assigned_workouts(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status workout_session_status NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Logs
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  performed_sets JSONB DEFAULT '[]',
  duration_seconds INT DEFAULT 0,
  calories_estimated INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Progress Metrics
CREATE TABLE public.progress_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type progress_type NOT NULL DEFAULT 'weight',
  value NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rule JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Member Badges
CREATE TABLE public.member_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Access Credentials
CREATE TABLE public.access_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type credential_type NOT NULL DEFAULT 'qr',
  token_hash TEXT NOT NULL,
  status credential_status NOT NULL DEFAULT 'active',
  rotate_interval_minutes INT DEFAULT 30,
  last_rotated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Devices
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  type device_type NOT NULL DEFAULT 'henry_turnstile',
  name TEXT NOT NULL,
  location TEXT,
  config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Access Logs
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  credential_id UUID REFERENCES public.access_credentials(id) ON DELETE SET NULL,
  event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  decision access_decision NOT NULL DEFAULT 'deny',
  reason TEXT,
  raw JSONB DEFAULT '{}'
);

-- AI Generation Jobs
CREATE TABLE public.ai_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  status ai_job_status NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'promotion',
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Daily Metrics
CREATE TABLE public.user_daily_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID NOT NULL REFERENCES public.gyms(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  day DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_burned INT NOT NULL DEFAULT 0,
  calories_goal INT NOT NULL DEFAULT 2500,
  active_minutes INT NOT NULL DEFAULT 0,
  steps INT NOT NULL DEFAULT 0,
  distance_km NUMERIC NOT NULL DEFAULT 0,
  avg_pace TEXT,
  workout_time_minutes INT NOT NULL DEFAULT 0,
  workouts_completed_today INT NOT NULL DEFAULT 0,
  workouts_completed_week INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  intensity_score INT NOT NULL DEFAULT 0,
  weekly_workout_goal INT NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

-- Onboarding Data
CREATE TABLE public.onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fitness_goal TEXT,
  experience_level TEXT,
  activity_level TEXT,
  gender TEXT,
  age INT,
  height INT,
  weight INT,
  equipment TEXT[],
  workout_duration TEXT,
  workout_location TEXT,
  preferred_time TEXT,
  injuries TEXT[],
  reminders TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- User Goals
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store Categories
CREATE TABLE public.store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  banner_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(gym_id, slug)
);

-- Store Products
CREATE TABLE public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.store_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  ingredients_or_materials JSONB DEFAULT '[]'::jsonb,
  usage_instructions TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  price_cents INT NOT NULL DEFAULT 0,
  compare_at_price_cents INT,
  stock_quantity INT NOT NULL DEFAULT 0,
  sku TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_promotion BOOLEAN NOT NULL DEFAULT false,
  promotion_label TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(gym_id, slug)
);

-- Store Cart Items
CREATE TABLE public.store_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(member_id, product_id)
);

-- Store Orders
CREATE TABLE public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cents INT NOT NULL DEFAULT 0,
  payment_provider TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store Order Items
CREATE TABLE public.store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.store_products(id) ON DELETE SET NULL,
  name_snapshot TEXT NOT NULL,
  price_cents_snapshot INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1
);

-- Coach Profiles
CREATE TABLE public.coach_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gyms(id),
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0,
  instagram TEXT,
  whatsapp TEXT,
  available_for_chat BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, gym_id)
);

-- ============================================
-- 3. ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. SECURITY DEFINER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_gym_role(_user_id UUID, _gym_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND gym_id = _gym_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_gym_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT gym_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_gym_staff(_user_id UUID, _gym_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND gym_id = _gym_id AND role IN ('owner', 'coach')
  )
$$;

CREATE OR REPLACE FUNCTION public.find_profile_by_email(_email text)
RETURNS TABLE(id uuid, gym_id uuid, name text, email text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.id, p.gym_id, p.name, p.email
  FROM public.profiles p
  WHERE p.email = _email
  LIMIT 1;
$$;

-- ============================================
-- 5. RLS POLICIES
-- ============================================

-- GYMS
CREATE POLICY "Super admin sees all gyms" ON public.gyms FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users see own gym" ON public.gyms FOR SELECT USING (id = public.get_user_gym_id(auth.uid()));
CREATE POLICY "Super admin manages gyms" ON public.gyms FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- PROFILES
CREATE POLICY "Users see own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Staff sees gym profiles" ON public.profiles FOR SELECT USING (public.is_gym_staff(auth.uid(), gym_id));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Staff manages gym profiles" ON public.profiles FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Members see gym coaches" ON public.profiles FOR SELECT USING (
  gym_id = get_user_gym_id(auth.uid())
  AND (
    has_gym_role(profiles.id, profiles.gym_id, 'coach'::app_role)
    OR has_gym_role(profiles.id, profiles.gym_id, 'owner'::app_role)
  )
);

-- USER_ROLES
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Owners manage gym roles" ON public.user_roles FOR ALL USING (
  public.has_gym_role(auth.uid(), gym_id, 'owner') OR public.has_role(auth.uid(), 'super_admin')
);

-- PLANS
CREATE POLICY "Gym members see plans" ON public.plans FOR SELECT USING (gym_id = public.get_user_gym_id(auth.uid()));
CREATE POLICY "Staff manages plans" ON public.plans FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- MEMBERSHIPS
CREATE POLICY "Members see own membership" ON public.memberships FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages memberships" ON public.memberships FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- SUBSCRIPTIONS
CREATE POLICY "Members see own subscriptions" ON public.subscriptions FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages subscriptions" ON public.subscriptions FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- PAYMENTS
CREATE POLICY "Members see own payments" ON public.payments FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages payments" ON public.payments FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- EXERCISES
CREATE POLICY "Gym sees exercises" ON public.exercises FOR SELECT USING (gym_id = public.get_user_gym_id(auth.uid()));
CREATE POLICY "Staff manages exercises" ON public.exercises FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- WORKOUT_TEMPLATES
CREATE POLICY "Gym sees templates" ON public.workout_templates FOR SELECT USING (gym_id = public.get_user_gym_id(auth.uid()));
CREATE POLICY "Staff manages templates" ON public.workout_templates FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- WORKOUT_DAYS
CREATE POLICY "Gym sees workout days" ON public.workout_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.workout_templates wt WHERE wt.id = template_id AND wt.gym_id = public.get_user_gym_id(auth.uid()))
);
CREATE POLICY "Staff manages workout days" ON public.workout_days FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workout_templates wt WHERE wt.id = template_id AND public.is_gym_staff(auth.uid(), wt.gym_id))
);

-- WORKOUT_ITEMS
CREATE POLICY "Gym sees workout items" ON public.workout_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workout_days wd
    JOIN public.workout_templates wt ON wt.id = wd.template_id
    WHERE wd.id = workout_day_id AND wt.gym_id = public.get_user_gym_id(auth.uid())
  )
);
CREATE POLICY "Staff manages workout items" ON public.workout_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.workout_days wd
    JOIN public.workout_templates wt ON wt.id = wd.template_id
    WHERE wd.id = workout_day_id AND public.is_gym_staff(auth.uid(), wt.gym_id)
  )
);

-- ASSIGNED_WORKOUTS
CREATE POLICY "Members see own assigned workouts" ON public.assigned_workouts FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages assigned workouts" ON public.assigned_workouts FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- WORKOUT_SESSIONS
CREATE POLICY "Members see own sessions" ON public.workout_sessions FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Members insert own sessions" ON public.workout_sessions FOR INSERT WITH CHECK (member_id = auth.uid());
CREATE POLICY "Members update own sessions" ON public.workout_sessions FOR UPDATE USING (member_id = auth.uid());
CREATE POLICY "Staff manages sessions" ON public.workout_sessions FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- WORKOUT_LOGS
CREATE POLICY "Members see own logs" ON public.workout_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.member_id = auth.uid())
);
CREATE POLICY "Members insert own logs" ON public.workout_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.member_id = auth.uid())
);
CREATE POLICY "Staff manages logs" ON public.workout_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND public.is_gym_staff(auth.uid(), ws.gym_id))
);

-- PROGRESS_METRICS
CREATE POLICY "Members see own metrics" ON public.progress_metrics FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Members insert own metrics" ON public.progress_metrics FOR INSERT WITH CHECK (member_id = auth.uid());
CREATE POLICY "Staff manages metrics" ON public.progress_metrics FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- BADGES
CREATE POLICY "Gym sees badges" ON public.badges FOR SELECT USING (gym_id = public.get_user_gym_id(auth.uid()));
CREATE POLICY "Staff manages badges" ON public.badges FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- MEMBER_BADGES
CREATE POLICY "Members see own badges" ON public.member_badges FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages member badges" ON public.member_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.badges b WHERE b.id = badge_id AND public.is_gym_staff(auth.uid(), b.gym_id))
);

-- ACCESS_CREDENTIALS
CREATE POLICY "Members see own credentials" ON public.access_credentials FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages credentials" ON public.access_credentials FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- DEVICES
CREATE POLICY "Staff sees devices" ON public.devices FOR SELECT USING (public.is_gym_staff(auth.uid(), gym_id));
CREATE POLICY "Staff manages devices" ON public.devices FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- ACCESS_LOGS
CREATE POLICY "Members see own access logs" ON public.access_logs FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Staff manages access logs" ON public.access_logs FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- AI_GENERATION_JOBS
CREATE POLICY "Staff sees ai jobs" ON public.ai_generation_jobs FOR SELECT USING (public.is_gym_staff(auth.uid(), gym_id));
CREATE POLICY "Staff manages ai jobs" ON public.ai_generation_jobs FOR ALL USING (public.is_gym_staff(auth.uid(), gym_id));

-- NOTIFICATIONS
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Staff manages notifications" ON public.notifications FOR ALL USING (is_gym_staff(auth.uid(), gym_id));

-- USER_DAILY_METRICS
CREATE POLICY "Users see own metrics" ON public.user_daily_metrics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users upsert own metrics" ON public.user_daily_metrics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own metrics" ON public.user_daily_metrics FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Staff manages metrics" ON public.user_daily_metrics FOR ALL USING (is_gym_staff(auth.uid(), gym_id));

-- ONBOARDING_DATA
CREATE POLICY "Users see own onboarding" ON public.onboarding_data FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own onboarding" ON public.onboarding_data FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own onboarding" ON public.onboarding_data FOR UPDATE USING (user_id = auth.uid());

-- USER_GOALS
CREATE POLICY "Users see own goals" ON public.user_goals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own goals" ON public.user_goals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own goals" ON public.user_goals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users delete own goals" ON public.user_goals FOR DELETE USING (user_id = auth.uid());

-- STORE_CATEGORIES
CREATE POLICY "Gym members see active categories" ON public.store_categories FOR SELECT TO authenticated
  USING (gym_id = get_user_gym_id(auth.uid()) AND is_active = true);
CREATE POLICY "Staff manages categories" ON public.store_categories FOR ALL TO authenticated
  USING (is_gym_staff(auth.uid(), gym_id));

-- STORE_PRODUCTS
CREATE POLICY "Gym members see active products" ON public.store_products FOR SELECT TO authenticated
  USING (gym_id = get_user_gym_id(auth.uid()) AND is_active = true);
CREATE POLICY "Staff manages products" ON public.store_products FOR ALL TO authenticated
  USING (is_gym_staff(auth.uid(), gym_id));

-- STORE_CART_ITEMS
CREATE POLICY "Members see own cart" ON public.store_cart_items FOR SELECT TO authenticated USING (member_id = auth.uid());
CREATE POLICY "Members insert own cart" ON public.store_cart_items FOR INSERT TO authenticated WITH CHECK (member_id = auth.uid());
CREATE POLICY "Members update own cart" ON public.store_cart_items FOR UPDATE TO authenticated USING (member_id = auth.uid());
CREATE POLICY "Members delete own cart" ON public.store_cart_items FOR DELETE TO authenticated USING (member_id = auth.uid());

-- STORE_ORDERS
CREATE POLICY "Members see own orders" ON public.store_orders FOR SELECT TO authenticated USING (member_id = auth.uid());
CREATE POLICY "Members insert own orders" ON public.store_orders FOR INSERT TO authenticated WITH CHECK (member_id = auth.uid());
CREATE POLICY "Staff manages orders" ON public.store_orders FOR ALL TO authenticated USING (is_gym_staff(auth.uid(), gym_id));

-- STORE_ORDER_ITEMS
CREATE POLICY "Members see own order items" ON public.store_order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.store_orders o WHERE o.id = store_order_items.order_id AND o.member_id = auth.uid())
);
CREATE POLICY "Members insert own order items" ON public.store_order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.store_orders o WHERE o.id = store_order_items.order_id AND o.member_id = auth.uid())
);
CREATE POLICY "Staff manages order items" ON public.store_order_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.store_orders o WHERE o.id = store_order_items.order_id AND is_gym_staff(auth.uid(), o.gym_id))
);

-- COACH_PROFILES
CREATE POLICY "Gym members see coach profiles" ON public.coach_profiles FOR SELECT TO authenticated
  USING (gym_id = get_user_gym_id(auth.uid()));
CREATE POLICY "Staff manages coach profiles" ON public.coach_profiles FOR ALL TO authenticated
  USING (is_gym_staff(auth.uid(), gym_id)) WITH CHECK (is_gym_staff(auth.uid(), gym_id));
CREATE POLICY "Coaches update own profile" ON public.coach_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================
-- 6. TRIGGERS & FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _gym_id uuid;
BEGIN
  SELECT id INTO _gym_id FROM public.gyms LIMIT 1;

  INSERT INTO public.profiles (id, name, email, gym_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    _gym_id
  );

  IF _gym_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, gym_id, role)
    VALUES (NEW.id, _gym_id, 'member');

    INSERT INTO public.memberships (member_id, gym_id, status)
    VALUES (NEW.id, _gym_id, 'active');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON public.store_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_store_cart_items_updated_at
  BEFORE UPDATE ON public.store_cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_coach_profiles_updated_at
  BEFORE UPDATE ON public.coach_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create credential on membership insert
CREATE OR REPLACE FUNCTION public.auto_create_credential()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.access_credentials
      WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id AND status = 'active'
    ) THEN
      INSERT INTO public.access_credentials (member_id, gym_id, token_hash, type, status)
      VALUES (
        NEW.member_id,
        NEW.gym_id,
        encode(extensions.gen_random_bytes(16), 'hex'),
        'qr',
        'active'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_create_credential
  AFTER INSERT ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_credential();

-- Auto-cancel on plan removal / reactivate on plan assignment
CREATE OR REPLACE FUNCTION public.auto_cancel_on_plan_removal()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Plan removed → cancel + block credentials
  IF OLD.plan_id IS NOT NULL AND NEW.plan_id IS NULL THEN
    NEW.status := 'cancelled';
    UPDATE public.access_credentials
    SET status = 'blocked'
    WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id AND status = 'active';
  END IF;

  -- Plan added → reactivate membership + credential
  IF NEW.plan_id IS NOT NULL AND (OLD.plan_id IS NULL OR OLD.plan_id != NEW.plan_id) AND OLD.status != 'active' THEN
    NEW.status := 'active';
    NEW.start_at := now();
    IF EXISTS (
      SELECT 1 FROM public.access_credentials
      WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id
    ) THEN
      UPDATE public.access_credentials
      SET status = 'active'
      WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id AND status = 'blocked'
      AND id = (
        SELECT id FROM public.access_credentials
        WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id
        ORDER BY created_at DESC LIMIT 1
      );
    ELSE
      INSERT INTO public.access_credentials (member_id, gym_id, token_hash, type, status)
      VALUES (NEW.member_id, NEW.gym_id, encode(extensions.gen_random_bytes(16), 'hex'), 'qr', 'active');
    END IF;
  END IF;

  -- Explicit cancel
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.access_credentials
    SET status = 'blocked'
    WHERE member_id = NEW.member_id AND gym_id = NEW.gym_id AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_cancel_on_plan_removal
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.auto_cancel_on_plan_removal();

-- ============================================
-- 7. DAILY METRICS CALCULATION
-- ============================================

CREATE OR REPLACE FUNCTION public.calculate_daily_metrics(_user_id uuid, _day date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _gym_id uuid;
  _calories int;
  _active_mins int;
  _workout_mins int;
  _workouts_today int;
  _workouts_week int;
  _intensity int;
  _streak int;
  _distance numeric;
  _steps int;
  _existing_goal int;
  _weekly_goal int;
BEGIN
  SELECT gym_id INTO _gym_id FROM profiles WHERE id = _user_id;
  IF _gym_id IS NULL THEN RETURN; END IF;

  SELECT calories_goal, weekly_workout_goal INTO _existing_goal, _weekly_goal
  FROM user_daily_metrics WHERE user_id = _user_id ORDER BY day DESC LIMIT 1;

  _existing_goal := COALESCE(_existing_goal, 2500);
  _weekly_goal := COALESCE(_weekly_goal, 5);

  SELECT COUNT(*) INTO _workouts_today
  FROM workout_sessions WHERE member_id = _user_id AND date = _day AND status = 'done';

  SELECT COUNT(*) INTO _workouts_week
  FROM workout_sessions WHERE member_id = _user_id
    AND date >= date_trunc('week', _day::timestamp)::date AND status = 'done';

  SELECT
    COALESCE(SUM(
      GREATEST(
        CASE 
          WHEN wl.calories_estimated > 0 THEN wl.calories_estimated 
          ELSE ROUND((GREATEST(wl.duration_seconds, 30)::numeric / 60) * 
            CASE
              WHEN LOWER(COALESCE(e.category, '')) LIKE '%aerób%' OR LOWER(COALESCE(e.muscle_group, '')) LIKE '%cardio%' THEN 10
              WHEN LOWER(COALESCE(e.category, '')) LIKE '%compound%' OR LOWER(COALESCE(e.category, '')) LIKE '%composto%' THEN 6.5
              WHEN LOWER(COALESCE(e.category, '')) LIKE '%isométr%' THEN 3.5
              WHEN LOWER(COALESCE(e.category, '')) LIKE '%isolamento%' OR LOWER(COALESCE(e.category, '')) LIKE '%isolation%' THEN 4.5
              ELSE 5.5
            END
          )
        END, 5
      )
    ), 0),
    COALESCE(SUM(GREATEST(wl.duration_seconds, 30)) / 60, 0),
    COALESCE(SUM(GREATEST(wl.duration_seconds, 30)) / 60, 0),
    COALESCE(SUM(
      CASE 
        WHEN LOWER(COALESCE(e.category, '')) LIKE '%aerób%' 
          OR LOWER(COALESCE(e.muscle_group, '')) LIKE '%cardio%'
          OR LOWER(COALESCE(e.name, '')) LIKE '%corrida%'
          OR LOWER(COALESCE(e.name, '')) LIKE '%esteira%'
          OR LOWER(COALESCE(e.name, '')) LIKE '%bicicleta%'
          OR LOWER(COALESCE(e.name, '')) LIKE '%elíptico%'
          OR LOWER(COALESCE(e.name, '')) LIKE '%pular corda%'
        THEN ROUND((GREATEST(wl.duration_seconds, 30)::numeric / 60) * 120)
        ELSE ROUND((GREATEST(wl.duration_seconds, 30)::numeric / 60) * 30)
      END
    ), 0)
  INTO _calories, _active_mins, _workout_mins, _steps
  FROM workout_logs wl
  JOIN workout_sessions ws ON ws.id = wl.session_id
  LEFT JOIN exercises e ON e.id = wl.exercise_id
  WHERE ws.member_id = _user_id AND ws.date = _day AND ws.status = 'done';

  IF _workout_mins > 0 THEN
    _intensity := LEAST(100, ROUND((_calories::numeric / _workout_mins) * 10));
  ELSE
    _intensity := 0;
  END IF;

  WITH daily AS (
    SELECT DISTINCT date FROM workout_sessions
    WHERE member_id = _user_id AND status = 'done' AND date <= _day
    ORDER BY date DESC
  ),
  numbered AS (
    SELECT date, _day - date::date AS gap, ROW_NUMBER() OVER (ORDER BY date DESC) - 1 AS rn
    FROM daily
  )
  SELECT COUNT(*) INTO _streak FROM numbered WHERE gap = rn;

  _distance := ROUND(_steps::numeric / 1300, 2);

  INSERT INTO user_daily_metrics (
    gym_id, user_id, day, calories_burned, calories_goal,
    active_minutes, workout_time_minutes,
    workouts_completed_today, workouts_completed_week,
    streak_days, intensity_score, distance_km, steps, weekly_workout_goal, updated_at
  ) VALUES (
    _gym_id, _user_id, _day, _calories, _existing_goal,
    _active_mins, _workout_mins, _workouts_today, _workouts_week,
    _streak, _intensity, _distance, _steps, _weekly_goal, now()
  )
  ON CONFLICT (user_id, day) DO UPDATE SET
    calories_burned = EXCLUDED.calories_burned,
    active_minutes = EXCLUDED.active_minutes,
    workout_time_minutes = EXCLUDED.workout_time_minutes,
    workouts_completed_today = EXCLUDED.workouts_completed_today,
    workouts_completed_week = EXCLUDED.workouts_completed_week,
    streak_days = EXCLUDED.streak_days,
    intensity_score = EXCLUDED.intensity_score,
    distance_km = EXCLUDED.distance_km,
    steps = EXCLUDED.steps,
    updated_at = now();
END;
$function$;

-- Trigger: recalculate on session change
CREATE OR REPLACE FUNCTION public.trigger_recalculate_metrics()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  PERFORM calculate_daily_metrics(
    COALESCE(NEW.member_id, OLD.member_id),
    COALESCE(NEW.date, OLD.date)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_recalculate_metrics_on_session
  AFTER INSERT OR UPDATE OF status ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_metrics();

-- Trigger: recalculate on log insert/update
CREATE OR REPLACE FUNCTION public.trigger_recalculate_metrics_from_log()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  _member_id uuid;
  _session_date date;
BEGIN
  SELECT member_id, date INTO _member_id, _session_date
  FROM workout_sessions WHERE id = COALESCE(NEW.session_id, OLD.session_id);

  IF _member_id IS NOT NULL THEN
    PERFORM calculate_daily_metrics(_member_id, _session_date);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_recalculate_metrics_on_log
  AFTER INSERT OR UPDATE ON public.workout_logs
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_metrics_from_log();

-- ============================================
-- 8. INDEXES
-- ============================================
CREATE INDEX idx_profiles_gym_id ON public.profiles(gym_id);
CREATE INDEX idx_user_roles_user_gym ON public.user_roles(user_id, gym_id);
CREATE INDEX idx_memberships_member ON public.memberships(member_id);
CREATE INDEX idx_memberships_gym ON public.memberships(gym_id);
CREATE INDEX idx_plans_gym ON public.plans(gym_id);
CREATE INDEX idx_plans_personal_trainer ON public.plans(personal_trainer_id);
CREATE INDEX idx_exercises_gym ON public.exercises(gym_id);
CREATE INDEX idx_workout_templates_gym ON public.workout_templates(gym_id);
CREATE INDEX idx_assigned_workouts_member ON public.assigned_workouts(member_id);
CREATE INDEX idx_workout_sessions_member ON public.workout_sessions(member_id);
CREATE INDEX idx_payments_member ON public.payments(member_id);
CREATE INDEX idx_access_logs_gym ON public.access_logs(gym_id);
CREATE INDEX idx_access_logs_member ON public.access_logs(member_id);
CREATE INDEX idx_access_credentials_member ON public.access_credentials(member_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_store_products_promotion ON public.store_products (is_promotion, is_active) WHERE is_promotion = true AND is_active = true;

-- ============================================
-- 9. REALTIME PUBLICATIONS
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.assigned_workouts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_daily_metrics;

-- ============================================
-- 10. STORAGE BUCKETS
-- (Execute separadamente se necessário)
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-media', 'exercise-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('store-products', 'store-products', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies: exercise-media
CREATE POLICY "Exercise media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'exercise-media');
CREATE POLICY "Staff can upload exercise media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exercise-media' AND auth.role() = 'authenticated');
CREATE POLICY "Staff can update exercise media" ON storage.objects FOR UPDATE USING (bucket_id = 'exercise-media' AND auth.role() = 'authenticated');
CREATE POLICY "Staff can delete exercise media" ON storage.objects FOR DELETE USING (bucket_id = 'exercise-media' AND auth.role() = 'authenticated');

-- Storage policies: avatars
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Storage policies: store-products
CREATE POLICY "Public read store product images" ON storage.objects FOR SELECT USING (bucket_id = 'store-products');
CREATE POLICY "Staff uploads store product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'store-products' AND is_gym_staff(auth.uid(), get_user_gym_id(auth.uid())));
CREATE POLICY "Staff updates store product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'store-products' AND is_gym_staff(auth.uid(), get_user_gym_id(auth.uid())));
CREATE POLICY "Staff deletes store product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'store-products' AND is_gym_staff(auth.uid(), get_user_gym_id(auth.uid())));

-- ============================================
-- FIM DO SCRIPT
-- ============================================
