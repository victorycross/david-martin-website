import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, AlertTriangle, BarChart3, Brain } from "lucide-react"

export default function ApplicationsSection() {
  const applications = [
    {
      title: "Crisis Management System",
      description: "Enterprise-grade crisis management platform with real-time communication, resource allocation, and automated response protocols for large organizations.",
      problem: "Organizations need rapid, coordinated responses during crisis situations with clear communication channels and resource tracking.",
      tech: ["React", "Node.js", "PostgreSQL", "WebSockets", "AWS"],
      status: "Production",
      github: "#",
      demo: "#",
      icon: <AlertTriangle className="h-6 w-6" />,
      featured: true,
    },
    {
      title: "Exception Tracking Dashboard",
      description: "Advanced monitoring and analytics platform for tracking application exceptions, performance metrics, and system health across distributed environments.",
      problem: "Development teams need comprehensive visibility into application errors and performance bottlenecks across multiple environments.",
      tech: ["TypeScript", "Next.js", "GraphQL", "InfluxDB", "Docker"],
      status: "Beta",
      github: "#",
      demo: "#",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "AI Risk Calculator",
      description: "Interactive tool for assessing AI implementation risks in financial services, providing regulatory compliance guidance and risk mitigation strategies.",
      problem: "Financial institutions need structured approaches to evaluate and mitigate risks associated with AI deployment.",
      tech: ["React", "Python", "FastAPI", "TensorFlow", "Azure"],
      status: "Prototype",
      github: "#",
      demo: "#",
      icon: <Brain className="h-6 w-6" />,
    }
  ]

  return (
    <div className="space-y-8">
      {applications.map((app, index) => (
        <Card key={index} className={`p-8 hover:shadow-medium transition-all duration-medium ${app.featured ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5' : ''}`}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  {app.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{app.title}</h3>
                    {app.featured && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={
                        app.status === 'Production' ? 'border-success text-success' :
                        app.status === 'Beta' ? 'border-warning text-warning' :
                        'border-muted-foreground text-muted-foreground'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {app.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                  Problem Solved
                </h4>
                <p className="text-foreground leading-relaxed">
                  {app.problem}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {app.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 rounded-xl p-6 h-full flex flex-col">
                <h4 className="font-semibold mb-4">Project Resources</h4>
                
                <div className="space-y-3 flex-grow">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    asChild
                  >
                    <a href={app.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={app.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-gradient-surface rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      📱
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Screenshots & demos coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          View All Projects on GitHub
        </Button>
      </div>
    </div>
  )
}