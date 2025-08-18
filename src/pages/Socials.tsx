import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, 
  Linkedin, 
  MessageSquare,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react"

export default function Socials() {
  const platforms = [
    {
      name: "LinkedIn",
      handle: "@dmartinpwc",
      description: "Professional insights on AI governance, technology risk, and national security innovation.",
      icon: <Linkedin className="h-6 w-6" />,
      link: "https://www.linkedin.com/in/dmartinpwc",
      stats: { followers: "Coming Soon", posts: "Coming Soon" },
      recent: [
        "Content coming soon...",
        "Stay tuned for insights",
        "More posts on the way"
      ]
    },
    {
      name: "Medium",
      handle: "@victorycross",
      description: "Deep-dive articles on technology trends, risk management methodologies, and industry analysis.",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "https://victorycross.medium.com",
      stats: { followers: "Coming Soon", posts: "Coming Soon" },
      recent: [
        "Articles coming soon...",
        "Deep dives in progress",
        "Publishing schedule TBD"
      ]
    }
  ]

  const talks = [
    {
      title: "Speaking engagements coming soon",
      event: "Future events TBD",
      date: "2024",
      type: "Coming Soon",
      link: "#"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Social Presence</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with me across platforms for insights on technology risk, AI governance, 
              and industry trends.
            </p>
          </div>

          {/* Platform Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {platforms.map((platform, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-all duration-medium">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{platform.name}</h3>
                      <p className="text-muted-foreground text-sm">{platform.handle}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <a href={platform.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {platform.description}
                </p>

                <div className="flex gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                    <div className="font-semibold text-primary">{platform.stats.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                    <div className="font-semibold text-primary">{platform.stats.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2">
                    {platform.recent.map((post, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground italic">
                        • {post}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Speaking Engagements */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Speaking Engagements & Talks</h2>
            </div>

            <div className="space-y-4">
              {talks.map((talk, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{talk.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {talk.date}
                      </span>
                      <span>•</span>
                      <span>{talk.event}</span>
                      <Badge variant="outline" className="text-xs">
                        {talk.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="mt-2 md:mt-0">
                    <a href={talk.link} target="_blank" rel="noopener noreferrer">
                      View Recording <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-muted-foreground">Speaking engagement calendar coming soon</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}