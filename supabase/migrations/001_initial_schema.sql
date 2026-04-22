-- EcoDrive Database Schema
-- Run this in your Supabase SQL editor

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Charging Stations Table
CREATE TABLE IF NOT EXISTS charging_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('existing', 'suggested', 'planned')),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  capacity INTEGER DEFAULT 2,
  utilization_rate DECIMAL(4, 3) DEFAULT 0,
  power_output_kw INTEGER DEFAULT 22,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'construction')),
  connector_types TEXT[] DEFAULT '{}',
  coverage_radius_km DECIMAL(5, 2) DEFAULT 2.5,
  population_density INTEGER DEFAULT 0,
  traffic_index DECIMAL(4, 3) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimization Results Table
CREATE TABLE IF NOT EXISTS optimization_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Plans Table
CREATE TABLE IF NOT EXISTS saved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  optimization_id UUID REFERENCES optimization_results(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "charging_stations_read" ON charging_stations FOR SELECT USING (true);
CREATE POLICY "optimization_results_own" ON optimization_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "saved_plans_own" ON saved_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_own" ON user_profiles FOR ALL USING (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_charging_stations_city ON charging_stations(city);
CREATE INDEX IF NOT EXISTS idx_charging_stations_type ON charging_stations(type);
CREATE INDEX IF NOT EXISTS idx_optimization_results_user ON optimization_results(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_plans_user ON saved_plans(user_id);

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
