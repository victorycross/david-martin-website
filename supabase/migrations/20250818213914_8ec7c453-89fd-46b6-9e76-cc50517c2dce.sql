-- Create artworks table
CREATE TABLE public.artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  medium TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Create policies for artworks
CREATE POLICY "Anyone can view artworks" 
ON public.artworks 
FOR SELECT 
USING (true);

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

-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);

-- Create storage policies
CREATE POLICY "Anyone can view artwork images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'artworks');

CREATE POLICY "Authenticated users can upload artwork images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'artworks' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own artwork images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'artworks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own artwork images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'artworks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_artworks_updated_at
BEFORE UPDATE ON public.artworks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();