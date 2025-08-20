import { ExternalLink, Smartphone, Brain, Heart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TechGadgetsSection() {
  const gadgets = [
    {
      name: "Muse S Headband",
      description: "Meditation feedback device for deeper mindfulness practice",
      icon: <Brain className="h-6 w-6" />,
      url: "https://choosemuse.com/pages/benefits",
      benefits: ["Real-time meditation feedback", "Sleep tracking", "Heart rate monitoring"],
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      name: "Apple Watch Ultra 2",
      description: "Comprehensive health and fitness tracking for active lifestyles",
      icon: <Heart className="h-6 w-6" />,
      url: "https://www.apple.com/ca/apple-watch-ultra-2/",
      benefits: ["Advanced fitness metrics", "Health monitoring", "Workout tracking"],
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      name: "Oura Ring Gen 3",
      description: "Continuous health monitoring with focus on recovery and sleep",
      icon: <Activity className="h-6 w-6" />,
      url: "https://ouraring.com/product/rings/oura-gen3",
      benefits: ["Sleep optimization", "Recovery insights", "Heart rate variability"],
      color: "bg-green-500/10 text-green-600"
    },
    {
      name: "Lumen Metabolic Tracker",
      description: "Breath analysis device for metabolic insights and nutrition guidance",
      icon: <Smartphone className="h-6 w-6" />,
      url: "https://www.lumen.me/",
      benefits: ["Metabolic flexibility", "Nutrition guidance", "Fuel utilization tracking"],
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Health Technology</CardTitle>
        </div>
        <CardDescription className="text-lg max-w-2xl mx-auto">
          While technology provides valuable insights, true health transformation comes from addressing 
          the inner barriers that prevent us from achieving our wellness goals.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Current Tech Stack */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-center">Current Tech Stack</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {gadgets.map((gadget) => (
              <Card key={gadget.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${gadget.color} flex items-center justify-center`}>
                      {gadget.icon}
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <a href={gadget.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{gadget.name}</CardTitle>
                  <CardDescription>{gadget.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {gadget.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-3 text-center">The Balance of Tracking & Inner Work</h4>
          <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            These devices provide valuable data and feedback, but they're tools—not solutions. 
            Sustainable health requires addressing the emotional, mental, and spiritual patterns 
            that drive our behaviors. Technology can guide us, but healing happens from within.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}