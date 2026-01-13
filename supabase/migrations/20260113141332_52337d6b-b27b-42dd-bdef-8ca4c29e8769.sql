-- Table pour tracker les visites de vérification QR code
CREATE TABLE public.qr_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id uuid REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
    verified_at timestamp with time zone NOT NULL DEFAULT now(),
    ip_address text,
    user_agent text
);

-- Enable RLS
ALTER TABLE public.qr_verifications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public verification)
CREATE POLICY "Anyone can log QR verification" 
ON public.qr_verifications 
FOR INSERT 
WITH CHECK (true);

-- Only admins/agents can view
CREATE POLICY "Admins and agents can view verifications" 
ON public.qr_verifications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'agent'));

-- Enable realtime for live stats
ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_verifications;