-- Fix RLS policies for artworks table
DROP POLICY IF EXISTS "Only owner can create artworks" ON public.artworks;
DROP POLICY IF EXISTS "Only owner can update artworks" ON public.artworks;  
DROP POLICY IF EXISTS "Only owner can delete artworks" ON public.artworks;

-- Create proper RLS policies for artworks table
CREATE POLICY "Users can create their own artworks" 
ON public.artworks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artworks" 
ON public.artworks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artworks" 
ON public.artworks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix RLS policies for posts table
DROP POLICY IF EXISTS "Only owner can create posts" ON public.posts;
DROP POLICY IF EXISTS "Only owner can update posts" ON public.posts;
DROP POLICY IF EXISTS "Only owner can delete posts" ON public.posts;

-- Create proper RLS policies for posts table
CREATE POLICY "Users can create their own posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);