import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"

interface SafeRouterProps {
  children: React.ReactNode
}

export function SafeRouter({ children }: SafeRouterProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Delay router initialization to ensure proper mounting
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <BrowserRouter>{children}</BrowserRouter>
}