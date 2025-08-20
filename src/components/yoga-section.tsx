import { Heart, Sunrise, Target, Zap, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export default function YogaSection() {
  return <Card className="overflow-hidden bg-gradient-primary text-white border-none shadow-elegant">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="h-8 w-8" />
          </div>
          <div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
              Featured Practice
            </Badge>
            <CardTitle className="text-3xl font-bold">Yoga Practice</CardTitle>
          </div>
        </div>
        <CardDescription className="text-white/80 text-lg">
          Physical and spiritual practice for flexibility, strength, and inner peace
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Breathe Studio Highlight */}
        <div className="bg-white/10 rounded-lg p-6 mb-8">
          <h4 className="font-semibold mb-4 text-xl flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Studio: Breathe Yoga Toronto
          </h4>
          <div className="space-y-3 text-white/90 leading-relaxed">
            <p>
              I practice regularly at <span className="font-semibold text-white">Breathe Yoga Studio</span> in Toronto, 
              where I've found my home in their "Yoga for Stiff Men" classes. This specialized program is 
              perfectly designed for those of us who need extra attention to flexibility and mobility.
            </p>
            <div className="flex gap-3 mt-4">
              <Button 
                size="sm" 
                className="text-primary bg-blue-950 hover:bg-blue-800"
                onClick={() => window.open('https://breatheyogastudio.com/', '_blank')}
              >
                Visit Breathe Studio
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-medium">Flexibility & Strength</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sunrise className="h-4 w-4" />
                </div>
                <span className="font-medium">Morning Routines</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4" />
                </div>
                <span className="font-medium">Balance & Harmony</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Focus</div>
                <div className="text-white/80">Flexibility</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Time</div>
                <div className="text-white/80">20-60 min</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Equipment</div>
                <div className="text-white/80">Yoga Mat</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Level</div>
                <div className="text-white/80">All Levels</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="text-primary bg-blue-950 hover:bg-blue-800">
                Explore Poses
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Practice Areas
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Morning Flow</span>
                <span className="text-white/80">Sun Salutations</span>
              </div>
              <div className="flex justify-between">
                <span>Flexibility</span>
                <span className="text-white/80">Deep Stretches</span>
              </div>
              <div className="flex justify-between">
                <span>Balance</span>
                <span className="text-white/80">Standing Poses</span>
              </div>
              <div className="flex justify-between">
                <span>Restoration</span>
                <span className="text-white/80">Gentle Flow</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Practice Description */}
        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h4 className="font-semibold mb-4 text-xl">Current Practice Focus</h4>
          <div className="space-y-4 text-white/90 leading-relaxed">
            <p>
              Yoga has become an integral part of my wellness routine, offering both physical benefits 
              and mental clarity. The specialized "Yoga for Stiff Men" program perfectly complements 
              my strength training and helps counteract the effects of desk work.
            </p>
            
            <div>
              <h5 className="font-semibold mb-2">Training Areas</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  Targeted flexibility work for tight hips, shoulders, and hamstrings
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  Strength-building poses that complement kettlebell training
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  Mobility sequences to counteract desk work and physical training
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  Breathing techniques for stress relief and mental clarity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}