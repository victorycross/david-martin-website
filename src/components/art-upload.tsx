import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { artworkService } from "@/lib/artwork-service"
import { useAuth } from "@/hooks/use-auth"

interface ArtUploadProps {
  onUploadSuccess?: () => void
}

export function ArtUpload({ onUploadSuccess }: ArtUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medium: "",
    year: new Date().getFullYear().toString(),
    category: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file")
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!user) {
      toast.error("You must be signed in to upload artwork")
      return
    }

    if (!selectedFile || !formData.title || !formData.medium) {
      toast.error("Please fill in all required fields and select an image")
      return
    }

    setIsUploading(true)

    try {
      // Upload artwork using the service
      await artworkService.uploadArtwork({
        title: formData.title,
        description: formData.description,
        medium: formData.medium,
        year: parseInt(formData.year),
        category: formData.category,
        file: selectedFile
      })

      toast.success("Artwork uploaded successfully!")
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        medium: "",
        year: new Date().getFullYear().toString(),
        category: ""
      })
      setSelectedFile(null)
      setIsOpen(false)
      
      onUploadSuccess?.()

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to upload artwork. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Artwork
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Artwork</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Image File *</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter artwork title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your artwork..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medium">Medium *</Label>
              <Select 
                value={formData.medium} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, medium: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Art">Digital Art</SelectItem>
                  <SelectItem value="AI Generated (MidJourney)">AI Generated (MidJourney)</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                  <SelectItem value="Traditional Art">Traditional Art</SelectItem>
                  <SelectItem value="3D Modeling">3D Modeling</SelectItem>
                  <SelectItem value="Video Art">Video Art</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Portrait">Portrait</SelectItem>
                <SelectItem value="Landscape">Landscape</SelectItem>
                <SelectItem value="Abstract">Abstract</SelectItem>
                <SelectItem value="Conceptual">Conceptual</SelectItem>
                <SelectItem value="Experimental">Experimental</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Artwork
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}