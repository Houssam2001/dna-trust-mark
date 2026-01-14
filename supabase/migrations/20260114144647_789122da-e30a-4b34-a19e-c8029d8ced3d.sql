-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all profiles for user management (agents can also view)
CREATE POLICY "Agents can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'agent'::app_role));