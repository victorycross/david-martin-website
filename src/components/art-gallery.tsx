import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ArtUpload } from "./art-upload"
import { artworkService, type Artwork } from "@/lib/artwork-service"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function ArtGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Artwork | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { user } = useAuth()

  const loadArtworks = async () => {
    try {
      setLoading(true)
      const data = await artworkService.getArtworks()
      setArtworks(data)
    } catch (error) {
      console.error('Failed to load artworks:', error)
      toast.error('Failed to load artworks')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) {
      return
    }

    try {
      await artworkService.deleteArtwork(id)
      setArtworks(prev => prev.filter(artwork => artwork.id !== id))
      toast.success('Artwork deleted successfully')
      if (selectedImage?.id === id) {
        setSelectedImage(null)
      }
    } catch (error) {
      console.error('Failed to delete artwork:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete artwork')
    }
  }

  useEffect(() => {
    loadArtworks()
  }, [])

  const handleUploadSuccess = () => {
    loadArtworks()
  }

  const filteredArtworks = selectedCategory === "all" 
    ? artworks 
    : artworks.filter(artwork => artwork.category?.toLowerCase() === selectedCategory.toLowerCase())

  const categories = ["all", ...Array.from(new Set(artworks.map(artwork => artwork.category).filter(Boolean)))]
  const featuredArtworks = artworks.slice(0, 6)

  const currentIndex = selectedImage ? filteredArtworks.findIndex(artwork => artwork.id === selectedImage.id) : -1

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return
    
    let newIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredArtworks.length - 1
    } else {
      newIndex = currentIndex < filteredArtworks.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedImage(filteredArtworks[newIndex])
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4" />
          <div className="h-4 bg-muted rounded w-64 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Digital Art Portfolio</h2>
          <p className="text-muted-foreground">
            A curated collection of MidJourney AI art and multimedia creations
          </p>
        </div>
        <ArtUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Featured Rotating Carousel */}
      {featuredArtworks.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Featured Works</h3>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredArtworks.map((artwork) => (
                <CarouselItem key={artwork.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(artwork)}>
                    <div className="relative">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-80 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h4 className="font-semibold text-lg mb-2">{artwork.title}</h4>
                          <Badge variant="secondary" className="mb-2">
                            {artwork.medium}
                          </Badge>
                          <p className="text-sm">{artwork.year}</p>
                        </div>
                      </div>
                      {user && user.id === artwork.user_id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteArtwork(artwork.id)
                          }}
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Main Gallery Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden group cursor-pointer">
              <div className="relative" onClick={() => setSelectedImage(artwork)}>
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-sm opacity-90">{artwork.medium}</p>
                    <p className="text-xs opacity-75">{artwork.year}</p>
                  </div>
                </div>
                {user && user.id === artwork.user_id && (
                  <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteArtwork(artwork.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{artwork.medium}</Badge>
                  <span className="text-sm text-muted-foreground">{artwork.year}</span>
                </div>
                {artwork.category && (
                  <Badge variant="outline" className="mt-2">
                    {artwork.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedCategory === "all" 
              ? "No artworks found. Upload your first piece to get started!" 
              : `No artworks found in the "${selectedCategory}" category.`
            }
          </p>
          {user && (
            <ArtUpload onUploadSuccess={handleUploadSuccess} />
          )}
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {filteredArtworks.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain"
              />
              
              <div className="p-6 bg-background border-t">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{selectedImage.medium}</Badge>
                  <Badge variant="outline">{selectedImage.year}</Badge>
                  {selectedImage.category && (
                    <Badge variant="outline">{selectedImage.category}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}