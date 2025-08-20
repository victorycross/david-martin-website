import { Brain, Play, Pause } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
export default function MeditationSection() {
  const [isReading, setIsReading] = useState(false);
  const meditationScript = ["Find a comfortable place to sit.", "Close your eyes.", "Take a slow breath in… and a gentle breath out.", "We begin.", "", "Be still, and know that I am God. [pause, two breaths]", "Be still, and know that I am. [pause, two breaths]", "Be still, and know. [pause, two breaths]", "Be still. [pause, two breaths]", "Be. [pause, three breaths]", "", "Return to the beginning.", "", "Be still, and know that I am God. [pause, two breaths]", "Be still, and know that I am. [pause, two breaths]", "Be still, and know. [pause, two breaths]", "Be still. [pause, two breaths]", "Be. [pause, three breaths]", "", "Again, return.", "", "Be still, and know that I am God. [pause, two breaths]", "Be still, and know that I am. [pause, two breaths]", "Be still, and know. [pause, two breaths]", "Be still. [pause, two breaths]", "Be. [pause, three breaths]", "", "One last time.", "", "Be still, and know that I am God. [pause, two breaths]", "Be still, and know that I am. [pause, two breaths]", "Be still, and know. [pause, two breaths]", "Be still. [pause, two breaths]", "Be. [pause, three breaths]", "", "Now let the words fade.", "Rest in the silence.", "Feel the stillness within you.", "Stay here for a few breaths… and when you are ready, gently open your eyes."];
  return <Card className="overflow-hidden bg-gradient-primary text-white border-none shadow-elegant">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
              Featured Practice
            </Badge>
            <CardTitle className="text-3xl font-bold">5-Minute Progressive Mantra Meditation</CardTitle>
          </div>
        </div>
        <CardDescription className="text-white/80 text-lg">
          A centering practice that progressively distills wisdom into pure being
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </div>
                <span className="font-medium">Progressive Mantra</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">5m</span>
                </div>
                <span className="font-medium">5 Minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="font-medium">Centering Practice</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Duration</div>
                <div className="text-white/80">5 Minutes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Type</div>
                <div className="text-white/80">Mantra</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Level</div>
                <div className="text-white/80">Beginner</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Position</div>
                <div className="text-white/80">Seated</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setIsReading(!isReading)} size="lg" className="text-primary bg-blue-950 hover:bg-blue-800">
                {isReading ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isReading ? "Hide Script" : "View Script"}
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              About This Practice
            </h4>
            <div className="space-y-3 text-sm text-white/90 leading-relaxed">
              <p>
                This progressive mantra meditation takes you through a beautiful journey of simplification, 
                starting with a complete phrase and gradually reducing it until you reach pure being.
              </p>
              <p>
                Each repetition invites you deeper into stillness, moving from conceptual understanding 
                to simply resting in the divine essence within yourself.
              </p>
            </div>
          </div>
        </div>
        
        {/* Meditation Script */}
        {isReading && <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h4 className="font-semibold mb-4 text-xl">Meditation Script</h4>
            <div className="space-y-3 text-white/90 leading-relaxed">
              {meditationScript.map((line, index) => <div key={index} className={`${line === "" ? "h-2" : ""}`}>
                  {line && <p className={`${line.startsWith("Be still") ? "font-medium text-white" : ""} ${line.includes("[pause") ? "italic text-white/70" : ""}`}>
                      {line}
                    </p>}
                </div>)}
            </div>
          </div>}
      </CardContent>
    </Card>;
}