-- Drop existing policies for INSERT, UPDATE, DELETE (keep SELECT policy for public viewing)
DROP POLICY IF EXISTS "Users can create their own artworks" ON public.artworks;
DROP POLICY IF EXISTS "Users can update their own artworks" ON public.artworks;
DROP POLICY IF EXISTS "Users can delete their own artworks" ON public.artworks;

-- Create new policies that only allow the owner (you) to manage artworks
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users
CREATE POLICY "Only owner can create artworks" 
ON public.artworks 
FOR INSERT 
WITH CHECK (auth.uid()::text = 'YOUR_USER_ID_HERE');

CREATE POLICY "Only owner can update artworks" 
ON public.artworks 
FOR UPDATE 
USING (auth.uid()::text = 'YOUR_USER_ID_HERE');

CREATE POLICY "Only owner can delete artworks" 
ON public.artworks 
FOR DELETE 
USING (auth.uid()::text = 'YOUR_USER_ID_HERE');

-- Note: The SELECT policy "Anyone can view artworks" remains unchanged for public viewing