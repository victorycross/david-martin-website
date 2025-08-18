import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar } from "lucide-react"

export default function Writing() {
  const posts = [
    {
      title: "Upcoming Articles on AI Governance",
      description: "Deep-dive articles on AI governance, national security, and technology risk management coming soon to LinkedIn and Medium.",
      date: "2024-12-01",
      platform: "LinkedIn",
      tags: ["AI Governance", "National Security", "Coming Soon"],
      link: "https://www.linkedin.com/in/dmartinpwc",
      featured: true
    },
    {
      title: "Technology Risk Insights",
      description: "Sharing insights from leading national security and AI trust initiatives. Articles in development.",
      date: "2024-12-01",
      platform: "Medium", 
      tags: ["Technology Risk", "AI Trust", "Coming Soon"],
      link: "https://victorycross.medium.com",
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Writing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts on national security, AI governance, technology risk, and insights from leading 
              AI trust initiatives. Articles and insights coming soon.
            </p>
          </div>

          {/* Author Section */}
          <div className="mb-12">
            <Card className="p-8 bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex gap-4 shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shadow-medium hover:shadow-lg transition-shadow cursor-pointer">
                      <span className="text-muted-foreground text-xs">Professional</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shadow-medium hover:shadow-lg transition-shadow cursor-pointer">
                      <span className="text-muted-foreground text-xs">Casual</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shadow-medium hover:shadow-lg transition-shadow cursor-pointer">
                      <span className="text-muted-foreground text-xs">AI Version</span>
                    </div>
                    <Badge className="absolute -top-2 -right-2 text-xs bg-primary/90 text-white">AI</Badge>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold mb-2">About the Author</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Experienced professional focused on AI governance, national security, and technology risk management. 
                    Contributing insights from leading AI trust initiatives and working at the intersection of innovation and responsibility.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card key={index} className={`p-6 hover:shadow-medium transition-all duration-medium ${post.featured ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                        {post.featured && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Coming Soon
                          </Badge>
                        )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {post.platform}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="shrink-0"
                    asChild
                    >
                      <a href={post.link} target="_blank" rel="noopener noreferrer">
                        {post.platform === "LinkedIn" ? "View LinkedIn" : "View Medium"} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center space-y-4">
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="text-muted-foreground mb-4">More articles coming soon!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <a href="https://www.linkedin.com/in/dmartinpwc" target="_blank" rel="noopener noreferrer">
                    Follow on LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://victorycross.medium.com" target="_blank" rel="noopener noreferrer">
                    Follow on Medium
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}