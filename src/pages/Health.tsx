import { ExternalLink, Dumbbell, Brain, Heart, Smartphone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

        {/* Featured Kettlebell Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="overflow-hidden bg-gradient-primary text-white border-none shadow-elegant">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Dumbbell className="h-8 w-8" />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
                    Featured Program
                  </Badge>
                  <CardTitle className="text-3xl font-bold">9-Day Kettlebell Fat Crusher</CardTitle>
                </div>
              </div>
              <CardDescription className="text-white/80 text-lg">
                Transform your body in just 9 days with high-intensity kettlebell workouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span>High-Intensity Workouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💪</span>
                      <span>Strength & Conditioning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span>Maximum Fat Burn</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="font-semibold">Duration</div>
                      <div className="text-white/80">9 Days</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="font-semibold">Time/Session</div>
                      <div className="text-white/80">30-45 min</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="font-semibold">Equipment</div>
                      <div className="text-white/80">Kettlebells</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="font-semibold">Level</div>
                      <div className="text-white/80">Intermediate</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      <a 
                        href="https://kettlebell9.netlify.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        Start Program
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <a 
                        href="https://github.com/victorycross/Kettlebell9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        View Code
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Program Structure
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Days 1, 3, 4</span>
                      <span className="text-white/80">Strength Circuits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Day 2</span>
                      <span className="text-white/80">EMOM Training</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Day 5</span>
                      <span className="text-white/80">Active Recovery</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detailed Description */}
              <div className="mt-8 bg-white/5 rounded-lg p-6">
                <h4 className="font-semibold mb-4 text-xl">Kettlebell 9 – My Fitness Journey</h4>
                <div className="space-y-4 text-white/90 leading-relaxed">
                  <p>
                    The Kettlebell 9 App is a program I built based on a workout I first learned from trainer Omar Careng. 
                    I took detailed notes, recorded videos, and translated those sessions into a structured nine-day program 
                    that anyone can try. Creating this app has been part of my ongoing journey to stay active and motivated, 
                    and I hope it can support others as well.
                  </p>
                  
                  <div>
                    <h5 className="font-semibold mb-2">What you'll find in the app</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        A nine-day kettlebell plan combining strength circuits, EMOM training, power ladders, and a dedicated recovery day
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        Workouts designed to improve strength, conditioning, mobility, and fat burn
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        Clear progression with options to scale intensity using 15 lb or 25 lb kettlebells (or dumbbells as alternatives)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        A recovery day with walking, yoga, or light band work to promote mobility and rest
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Please keep in mind</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        Always warm up before each session
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        Stretch after workouts to support recovery
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        Choose weights that are safe and appropriate for your level
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                        The program is provided for general fitness only and is not a substitute for medical or professional advice
                      </li>
                    </ul>
                  </div>
                  
                  <p className="italic">
                    For me, fitness is a constant journey. Building this app is both a personal motivator and a way to share 
                    what I've learned with anyone looking to explore kettlebell training.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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