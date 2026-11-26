-- Schema SQL para o SaaS de Barbearias

CREATE TABLE IF NOT EXISTS barbershops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  service_id UUID REFERENCES services(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS
ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
