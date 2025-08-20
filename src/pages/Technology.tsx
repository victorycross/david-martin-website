import { useState } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplicationsSection from "@/components/applications-section";
import TechRiskSection from "@/components/tech-risk-section";

const technologySections = [
  { id: 'applications', name: 'Applications', component: ApplicationsSection },
  { id: 'tech-risk', name: 'Tech Risk', component: TechRiskSection }
];

export default function Technology() {
  const [currentSection, setCurrentSection] = useState(0);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % technologySections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + technologySections.length) % technologySections.length);
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  const CurrentComponent = technologySections[currentSection].component;

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Technology</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Software solutions and technology risk management approaches 
              for building better systems and making informed decisions.
            </p>
          </div>

          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">Featured Technology</h2>
              <div className="flex gap-2">
                {technologySections.map((section, index) => (
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
      </div>
    </div>
  );
}