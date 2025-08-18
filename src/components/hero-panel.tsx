import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface HeroPanelProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  gradient?: string
  className?: string
}

export function HeroPanel({ 
  title, 
  description, 
  icon, 
  href, 
  gradient = "bg-gradient-primary",
  className = "" 
}: HeroPanelProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className={`panel-hover p-8 h-full border-2 transition-all duration-medium hover:border-primary/20 ${className}`}>
        <div className="flex flex-col h-full">
          <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center mb-6`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">{description}</p>
          <div className="flex items-center text-primary font-medium">
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Link to={href} className="group">
      <Card className={`panel-hover p-8 h-full border-2 transition-all duration-medium hover:border-primary/20 ${className}`}>
        <div className="flex flex-col h-full">
          <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-medium`}>
            {icon}
          </div>
          
          <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient transition-all duration-medium">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-medium">
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  )
}