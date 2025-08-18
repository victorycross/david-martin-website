import { useState } from "react"
import { cn } from "@/lib/utils"
import { Music } from "lucide-react"

interface SpotifyEmbedProps {
  src: string
  title?: string
  height?: number
  className?: string
  compact?: boolean
}

export function SpotifyEmbed({ 
  src, 
  title = "Spotify Player", 
  height = 352, 
  className,
  compact = false 
}: SpotifyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const embedHeight = compact ? 152 : height

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex flex-col items-center justify-center bg-muted rounded-lg text-muted-foreground",
          className
        )}
        style={{ height: embedHeight }}
      >
        <Music className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">Unable to load Spotify content</p>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg text-muted-foreground z-10"
          style={{ height: embedHeight }}
        >
          <Music className="h-8 w-8 mb-2 opacity-50 animate-pulse" />
          <p className="text-sm">Loading Spotify content...</p>
        </div>
      )}
      <iframe
        src={src}
        width="100%"
        height={embedHeight}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
        className="rounded-lg"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}