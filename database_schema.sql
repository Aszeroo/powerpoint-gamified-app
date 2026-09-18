-- Database Schema for PowerPoint Gamified Training App

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  challenges_completed INTEGER DEFAULT 0,
  tutorials_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tutorials table
CREATE TABLE IF NOT EXISTS public.tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER, -- in minutes
  xp_reward INTEGER DEFAULT 50,
  content JSONB, -- Tutorial content structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER, -- in minutes
  xp_reward INTEGER DEFAULT 50,
  challenge_data JSONB, -- Challenge-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenges junction table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- User tutorials junction table
CREATE TABLE IF NOT EXISTS public.user_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_tutorials_user_id ON user_tutorials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tutorials_tutorial_id ON user_tutorials(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON user_stats(total_xp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tutorials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view tutorials" ON public.tutorials
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view challenges" ON public.challenges
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own challenge progress" ON public.user_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress" ON public.user_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tutorial progress" ON public.user_tutorials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tutorial progress" ON public.user_tutorials
  FOR INSERT WITH CHECK (auth.uid() = user_id);