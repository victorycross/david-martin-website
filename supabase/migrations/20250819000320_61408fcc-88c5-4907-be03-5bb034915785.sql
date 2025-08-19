-- Drop existing policies for posts table
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Owner can view all their posts" ON public.posts;
DROP POLICY IF EXISTS "Owner can create posts" ON public.posts;
DROP POLICY IF EXISTS "Owner can update their posts" ON public.posts;
DROP POLICY IF EXISTS "Owner can delete their posts" ON public.posts;

-- Create new policies similar to artworks table
CREATE POLICY "Anyone can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Only owner can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK ((auth.uid())::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25'::text);

CREATE POLICY "Only owner can update posts" 
ON public.posts 
FOR UPDATE 
USING ((auth.uid())::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25'::text);

CREATE POLICY "Only owner can delete posts" 
ON public.posts 
FOR DELETE 
USING ((auth.uid())::text = '7f2be94a-c07d-4a86-aeb4-2cd51faa8a25'::text);