import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { 
  Building2, 
  GraduationCap, 
  Music, 
  Bike, 
  Hammer,
  Brain,
  Shield,
  Mail,
  MapPin
} from "lucide-react"

export default function About() {
  const skills = [
    "AI Governance", "Technology Risk", "Financial Services", "Regulatory Compliance",
    "React", "TypeScript", "Python", "Node.js", "AWS", "System Design"
  ]

  const interests = [
    { icon: <Music className="h-5 w-5" />, label: "Music Production", description: "Piano and guitar compositions" },
    { icon: <Bike className="h-5 w-5" />, label: "Motorcycles", description: "Weekend touring and maintenance" },
    { icon: <Hammer className="h-5 w-5" />, label: "Woodworking", description: "Furniture and artistic pieces" },
    { icon: <Brain className="h-5 w-5" />, label: "AI Research", description: "Following latest developments" },
  ]

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">About Me</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leader for National Security, AI Trust and Technology Risk, creative problem solver, and lifelong learner 
              at the intersection of innovation and responsibility.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">DM</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">David Martin</h2>
                  <p className="text-muted-foreground text-sm">Leader, National Security, AI Trust & Technology Risk</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>PwC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Based in [Location]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>AI Governance Specialist</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Use the contact form to reach out securely
                  </p>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Professional Background */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Professional Background</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As the leader for National Security, AI Trust and Technology Risk at PwC, I specialize in AI governance and risk management 
                  across national security and financial services sectors. My work focuses on helping organizations navigate 
                  the complex regulatory landscape while implementing innovative AI solutions responsibly.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I bring a unique perspective that combines technical expertise with national security insight and regulatory knowledge, 
                  ensuring that cutting-edge technology deployments meet both security objectives and 
                  compliance requirements.
                </p>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Personal Interests */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Music className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Personal Interests</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="text-primary mt-1">
                        {interest.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{interest.label}</h4>
                        <p className="text-sm text-muted-foreground">{interest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Philosophy */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Philosophy</h3>
                <blockquote className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-6">
                  "Technology should amplify human creativity and solve meaningful problems. 
                  My approach combines rigorous risk management with innovative thinking to 
                  build solutions that are both cutting-edge and responsible."
                </blockquote>
              </Card>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}