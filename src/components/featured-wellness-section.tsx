import { useState } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MeditationSection from "./meditation-section";
import YogaSection from "./yoga-section";
import KettlebellSection from "./kettlebell-section";
import TechGadgetsSection from "./tech-gadgets-section";

const wellnessSections = [
  { id: 'kettlebell', name: 'Kettlebell', component: KettlebellSection },
  { id: 'meditation', name: 'Meditation', component: MeditationSection },
  { id: 'yoga', name: 'Yoga', component: YogaSection },
  { id: 'tech', name: 'Tech Gadgets', component: TechGadgetsSection }
];

export default function FeaturedWellnessSection() {
  const [currentSection, setCurrentSection] = useState(0);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % wellnessSections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + wellnessSections.length) % wellnessSections.length);
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  const CurrentComponent = wellnessSections[currentSection].component;

  return (
    <div className="max-w-6xl mx-auto mb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Featured Practice</h2>
          <div className="flex gap-2">
            {wellnessSections.map((section, index) => (
              <Badge 
                key={section.id}
                variant={index === currentSection ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => goToSection(index)}
              >
                {section.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSection}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToSection(0)}
            className="h-8 w-8 p-0"
            title="Go to first section"
          >
            <Home className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSection}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Section */}
      <CurrentComponent />
    </div>
  );
}