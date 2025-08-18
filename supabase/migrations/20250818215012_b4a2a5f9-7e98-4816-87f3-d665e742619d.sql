-- Update policies to use the actual user ID for victorycross@gmail.com
DROP POLICY IF EXISTS "Only owner can create artworks" ON public.artworks;
DROP POLICY IF EXISTS "Only owner can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Only owner can delete artworks" ON public.artworks;

-- Create new policies that only allow victorycross@gmail.com to manage artworks
CREATE POLICY "Only owner can create artworks" 
ON public.artworks 
FOR INSERT 
WITH CHECK (auth.uid()::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25');

CREATE POLICY "Only owner can update artworks" 
ON public.artworks 
FOR UPDATE 
USING (auth.uid()::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25');

CREATE POLICY "Only owner can delete artworks" 
ON public.artworks 
FOR DELETE 
USING (auth.uid()::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25');