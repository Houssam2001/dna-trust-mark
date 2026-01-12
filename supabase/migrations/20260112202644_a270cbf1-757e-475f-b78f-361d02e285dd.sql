-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'owner');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Establishment types enum
CREATE TYPE public.establishment_type AS ENUM ('boucherie', 'restaurant', 'usine', 'traiteur', 'autre');

-- Certification status enum
CREATE TYPE public.certification_status AS ENUM ('conforme', 'non_conforme', 'en_attente', 'suspendu');

-- Establishments table
CREATE TABLE public.establishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type establishment_type NOT NULL DEFAULT 'autre',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    siret TEXT,
    status certification_status NOT NULL DEFAULT 'en_attente',
    adnguard_code TEXT UNIQUE,
    certified_since DATE,
    last_control_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

-- Controls table (ADN tests)
CREATE TABLE public.controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    control_date DATE NOT NULL DEFAULT CURRENT_DATE,
    result certification_status NOT NULL DEFAULT 'en_attente',
    species_analyzed TEXT[] DEFAULT '{}',
    species_detected TEXT[] DEFAULT '{}',
    anomalies_detected TEXT,
    report_id TEXT UNIQUE,
    report_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;

-- Certifications table (QR codes and validity)
CREATE TABLE public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
    qr_code TEXT UNIQUE NOT NULL,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Function to generate ADNGUARD code
CREATE OR REPLACE FUNCTION public.generate_adnguard_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    year_part TEXT;
    seq_num INTEGER;
    new_code TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(adnguard_code, '-', 3) AS INTEGER)
    ), 0) + 1 INTO seq_num
    FROM public.establishments
    WHERE adnguard_code LIKE 'ADN-' || year_part || '-%';
    
    new_code := 'ADN-' || year_part || '-' || LPAD(seq_num::TEXT, 3, '0');
    NEW.adnguard_code := new_code;
    RETURN NEW;
END;
$$;

-- Trigger to auto-generate ADNGUARD code
CREATE TRIGGER generate_adnguard_code_trigger
    BEFORE INSERT ON public.establishments
    FOR EACH ROW
    WHEN (NEW.adnguard_code IS NULL)
    EXECUTE FUNCTION public.generate_adnguard_code();

-- Function to generate report ID
CREATE OR REPLACE FUNCTION public.generate_report_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    year_part TEXT;
    seq_num INTEGER;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(report_id, '-', 2) AS INTEGER)
    ), 0) + 1 INTO seq_num
    FROM public.controls
    WHERE report_id LIKE 'RPT-' || year_part || '-%';
    
    NEW.report_id := 'RPT-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$;

-- Trigger to auto-generate report ID
CREATE TRIGGER generate_report_id_trigger
    BEFORE INSERT ON public.controls
    FOR EACH ROW
    WHEN (NEW.report_id IS NULL)
    EXECUTE FUNCTION public.generate_report_id();

-- Function to update establishment status after control
CREATE OR REPLACE FUNCTION public.update_establishment_after_control()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.establishments
    SET 
        last_control_date = NEW.control_date,
        status = NEW.result,
        certified_since = CASE 
            WHEN certified_since IS NULL AND NEW.result = 'conforme' THEN NEW.control_date
            ELSE certified_since
        END,
        updated_at = now()
    WHERE id = NEW.establishment_id;
    RETURN NEW;
END;
$$;

-- Trigger to update establishment after control
CREATE TRIGGER update_establishment_after_control_trigger
    AFTER INSERT OR UPDATE ON public.controls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_establishment_after_control();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at
    BEFORE UPDATE ON public.establishments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_controls_updated_at
    BEFORE UPDATE ON public.controls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- User roles: Only admins can manage roles
CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can insert roles"
    ON public.user_roles FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
    ON public.user_roles FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Establishments: Public read for verification, admins/agents can manage
CREATE POLICY "Anyone can view establishments"
    ON public.establishments FOR SELECT
    USING (true);

CREATE POLICY "Admins and agents can insert establishments"
    ON public.establishments FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Admins and agents can update establishments"
    ON public.establishments FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Only admins can delete establishments"
    ON public.establishments FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Controls: Public read for verification, admins/agents can manage
CREATE POLICY "Anyone can view controls"
    ON public.controls FOR SELECT
    USING (true);

CREATE POLICY "Admins and agents can insert controls"
    ON public.controls FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Admins and agents can update controls"
    ON public.controls FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Only admins can delete controls"
    ON public.controls FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Certifications: Public read, admins can manage
CREATE POLICY "Anyone can view certifications"
    ON public.certifications FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert certifications"
    ON public.certifications FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update certifications"
    ON public.certifications FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete certifications"
    ON public.certifications FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));