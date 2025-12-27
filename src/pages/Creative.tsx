import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpotifyEmbed } from "@/components/ui/spotify-embed"
import { ArtUpload } from "@/components/art-upload"
import { ArtGallery } from "@/components/art-gallery"
import { Music, Image as ImageIcon, Archive, ExternalLink, Lock } from "lucide-react"

export default function Creative() {
  const [artRefreshTrigger, setArtRefreshTrigger] = useState(0)

  const musicProjects = [
    {
      title: "Lofi Girl",
      description: "Perfect background music for focused programming sessions and creative work.",
      genre: "Lofi Hip Hop",
      tracks: "50+ tracks",
      embed: "https://open.spotify.com/embed/playlist/37i9dQZF1E4yVfD4M4LwFh?utm_source=generator",
    },
    {
      title: "Album Discovery",
      description: "Featured album selection showcasing diverse musical expressions and artistic creativity.",
      genre: "Featured Album",
      tracks: "Album tracks", 
      embed: "https://open.spotify.com/embed/album/48D1hRORqJq52qsnUYZX56?utm_source=generator",
    },
    {
      title: "Cocteau Twins Radio",
      description: "Ethereal soundscapes and dreamy textures for contemplative moments.",
      genre: "Dream Pop/Shoegaze",
      tracks: "40+ tracks",
      embed: "https://open.spotify.com/embed/playlist/37i9dQZF1E4lRkwtpIt1y2?utm_source=generator",
    }
  ]

  const artProjects = {
    description: "A collection of digital art, AI-generated pieces, and multimedia creations spanning several years of artistic exploration."
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="container py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl md:text-5xl font-playfair font-normal mb-6 text-[#2C2C2C]">
              Creative Projects
            </h1>
            <p className="text-lg text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
              A collection of musical compositions, visual art, and creative explorations 
              at the intersection of technology and artistic expression.
            </p>
          </div>

          {/* Family History Archive Card */}
          <div className="mb-12">
            <a 
              href="https://history.david-martin.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-[#E8EFEB] flex items-center justify-center flex-shrink-0">
                    <Archive className="h-7 w-7 text-[#5B7B6D]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-playfair text-[#2C2C2C]">Martin Family Archive</h3>
                      <div className="flex items-center gap-1 text-xs text-[#6B6B6B] bg-[#F5F5F3] px-2 py-1 rounded">
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </div>
                    </div>
                    <p className="text-[#6B6B6B] leading-relaxed mb-4">
                      Six generations of family history spanning the Stainton, Jørgensen, and Martin lines. 
                      Explore historical photographs, Danish church records, WWI memorials, and immigration stories from 1550 to present.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[#5B7B6D] text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Enter Archive <ExternalLink className="h-4 w-4" />
                      </span>
                      <span className="text-xs text-[#6B6B6B]">107 photographs · 6 family lines</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-10 bg-white border border-[#E5E5E3] rounded-lg p-1">
              <TabsTrigger value="music" className="flex items-center gap-2 data-[state=active]:bg-[#5B7B6D] data-[state=active]:text-white rounded-md transition-all">
                <Music className="h-4 w-4" />
                Music
              </TabsTrigger>
              <TabsTrigger value="art" className="flex items-center gap-2 data-[state=active]:bg-[#5B7B6D] data-[state=active]:text-white rounded-md transition-all">
                <ImageIcon className="h-4 w-4" />
                Visual Art
              </TabsTrigger>
            </TabsList>

            <TabsContent value="music" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {musicProjects.map((project, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]">
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-playfair mb-2 text-[#2C2C2C]">{project.title}</h3>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-xs px-2 py-1 bg-[#E8EFEB] text-[#5B7B6D] rounded">{project.genre}</span>
                            <span className="text-xs text-[#6B6B6B]">{project.tracks}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="px-6 pb-6">
                      <SpotifyEmbed 
                        src={project.embed}
                        title={project.title}
                        compact={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <div className="bg-white rounded-xl p-6 border border-[#E5E5E3]">
                  <p className="text-[#6B6B6B] text-sm">
                    Discover more playlists and musical interests through the embedded players above
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="art" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-playfair mb-2 text-[#2C2C2C]">Visual Art Portfolio</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    {artProjects.description}
                  </p>
                </div>
                <ArtUpload onUploadSuccess={() => setArtRefreshTrigger(prev => prev + 1)} />
              </div>
              
              <ArtGallery />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
