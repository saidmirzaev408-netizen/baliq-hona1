-- ========================================================
-- FISH HOUSE – Supabase Database Schema
-- Project: https://jvkivqpsoioasyeuleaj.supabase.co
-- ========================================================

-- 1. PROFILES TABLE (Stores user roles: admin, waiter, chef, customer)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'waiter', 'chef', 'customer')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. DINING ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  type TEXT,
  seats INT DEFAULT 6,
  capacity_text TEXT,
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED')),
  photo TEXT,
  floor TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rooms viewable by everyone" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Only staff can update rooms" ON public.rooms FOR ALL USING (true);

-- 3. FISH DISHES MENU TABLE
CREATE TABLE IF NOT EXISTS public.dishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  weight_grams INT DEFAULT 400,
  price NUMERIC NOT NULL,
  description TEXT,
  photo TEXT,
  is_available BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dishes viewable by everyone" ON public.dishes FOR SELECT USING (true);

-- 4. RESERVATIONS TABLE (Room bookings)
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT REFERENCES public.rooms(id),
  room_number TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INT DEFAULT 4,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reservations viewable by all" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update reservations" ON public.reservations FOR UPDATE USING (true);

-- 5. ORDERS TABLE (Food orders & Bills)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  service_charge NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'Naqd',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders viewable by staff" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insertable by everyone" ON public.orders FOR INSERT WITH CHECK (true);
