import { supabase } from "@/integrations/supabase/client"

export interface Artwork {
  id: string
  title: string
  description: string | null
  medium: string
  year: number
  category: string | null
  image_url: string
  created_at: string
  user_id: string
}

export const artworkService = {
  async getArtworks(): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch artworks: ${error.message}`)
    }

    return data || []
  },

  async uploadArtwork(formData: {
    title: string
    description: string
    medium: string
    year: number
    category: string
    file: File
  }): Promise<Artwork> {
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('You must be logged in to upload artwork')
    }

    try {
      // Upload file to storage
      const fileExt = formData.file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, formData.file)

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName)

      // Insert artwork record
      const { data, error } = await supabase
        .from('artworks')
        .insert({
          title: formData.title,
          description: formData.description || null,
          medium: formData.medium,
          year: formData.year,
          category: formData.category || null,
          image_url: urlData.publicUrl,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save artwork: ${error.message}`)
      }

      return data
    } catch (error) {
      // Clean up uploaded file if database insert failed
      console.error('Upload failed:', error)
      throw error
    }
  },

  async deleteArtwork(id: string): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('You must be logged in to delete artwork')
    }

    // Get the artwork to find the file path
    const { data: artwork, error: fetchError } = await supabase
      .from('artworks')
      .select('image_url, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !artwork) {
      throw new Error('Artwork not found')
    }

    if (artwork.user_id !== user.id) {
      throw new Error('You can only delete your own artwork')
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Failed to delete artwork: ${deleteError.message}`)
    }

    // Extract file path from URL and delete from storage
    try {
      const url = new URL(artwork.image_url)
      const filePath = url.pathname.split('/storage/v1/object/public/artworks/')[1]
      if (filePath) {
        await supabase.storage.from('artworks').remove([filePath])
      }
    } catch (error) {
      console.warn('Failed to delete file from storage:', error)
    }
  }
}