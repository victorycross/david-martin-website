import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = [
    {
      src: "/lovable-uploads/c89f9cc9-32ac-4ed7-bfa2-6b1856f74894.png",
      alt: "Professional black and white portrait",
      category: "Professional",
      description: "Classic black and white professional headshot"
    },
    {
      src: "/lovable-uploads/09d913d1-2fe9-4193-ac0e-46d503d86008.png",
      alt: "Casual family moment",
      category: "Personal",
      description: "Family time - enjoying a casual outdoor moment"
    },
    {
      src: "/lovable-uploads/d2af25eb-578d-40b8-a114-2fe131b4e0db.png",
      alt: "Winter outdoor adventure",
      category: "Lifestyle",
      description: "Winter outdoor adventure in the snow"
    },
    {
      src: "/lovable-uploads/4341aa23-8e7d-428d-bc52-0cf88f62e31c.png",
      alt: "Outdoor portrait with cap",
      category: "Casual",
      description: "Relaxed outdoor portrait"
    },
    {
      src: "/lovable-uploads/2ca0d6d3-64d7-437c-aa35-243da50437b9.png",
      alt: "London Eye travel photo",
      category: "Travel",
      description: "Iconic London Eye visit"
    },
    {
      src: "/lovable-uploads/c1970e61-dbda-436b-884a-18ab3fb5b8f7.png",
      alt: "Rush t-shirt by the water",
      category: "Lifestyle",
      description: "Enjoying music and waterfront views"
    },
    {
      src: "/lovable-uploads/54f0764f-7c11-44aa-9d2a-e7c9c2650e2d.png",
      alt: "Indoor selfie",
      category: "Casual",
      description: "Natural indoor lighting portrait"
    }
  ]

  const categories = ["All", ...Array.from(new Set(images.map(img => img.category)))]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Photo Gallery</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of personal and professional moments captured over time.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(image.src)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="mb-2">
                        {image.category}
                      </Badge>
                      <p className="text-sm">{image.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Modal for full-size image */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="max-w-4xl max-h-full">
                <img
                  src={selectedImage}
                  alt="Full size view"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}