import { Brain, Heart, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturedWellnessSection from "@/components/featured-wellness-section";

export default function Health() {
  const healthCategories = [
    {
      title: "Meditation",
      description: "Mindfulness practices and mental wellness techniques",
      icon: <Brain className="h-6 w-6" />,
      items: ["Daily meditation practice", "Breathing exercises", "Mindfulness techniques"],
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      title: "Yoga",
      description: "Physical and spiritual practice for flexibility and strength",
      icon: <Heart className="h-6 w-6" />,
      items: ["Morning routines", "Flexibility training", "Balance poses"],
      color: "bg-green-500/10 text-green-600"
    },
    {
      title: "Tech Gadgets",
      description: "Health and fitness technology that enhances wellness",
      icon: <Smartphone className="h-6 w-6" />,
      items: ["Fitness trackers", "Recovery devices", "Health monitors"],
      color: "bg-blue-500/10 text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Health & Wellness
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My journey toward optimal health through fitness, mindfulness, and technology
          </p>
        </div>

        {/* Featured Wellness Section */}
        <FeaturedWellnessSection />

        {/* Health Categories */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Wellness Areas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {healthCategories.map((category) => (
              <Card key={category.title} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Personal Journey Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">My Wellness Journey</CardTitle>
              <CardDescription className="text-lg">
                Continuous improvement through consistent practice and mindful choices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Current Focus Areas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Strength Training</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Cardiovascular Health</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Mental Wellness</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Recovery & Sleep</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Philosophy</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Health is not just about physical fitness—it's about creating sustainable habits 
                    that support mental clarity, emotional balance, and overall well-being. 
                    Technology can be a powerful ally when used mindfully.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}