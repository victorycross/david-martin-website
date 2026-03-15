import { Code, Palette, PenTool } from "lucide-react";
import { HeroPanel } from "@/components/hero-panel";
import { ContactForm } from "@/components/contact-form";
export default function Home() {
  return <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-700">
            <span className="text-gradient font-light text-slate-950">Create.</span>
            <br />
            <span className="text-gradient">Build.</span>
            <br />
            <span className="text-gradient font-light">Write.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm David Martin, leader for National Security, AI Trust and Technology Risk, 
            passionate about AI governance, creative projects, and meaningful solutions.
          </p>
        </div>

        {/* Three Panel Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <HeroPanel title="Create" description="Explore my creative journey through music, visual art, and innovative projects that blend technology with artistic expression." icon={<Palette className="h-8 w-8 text-white" />} href="/creative" gradient="bg-gradient-primary" />
          
          <HeroPanel title="Build" description="Discover applications, AI tools, technology risk frameworks, and practical AI prompts that solve real-world problems and drive informed decision-making." icon={<Code className="h-8 w-8 text-white" />} href="/technology" gradient="bg-accent" />
          
          <HeroPanel title="Write" description="Read my thoughts on technology risk, AI governance, and insights from my work in financial services and beyond." icon={<PenTool className="h-8 w-8 text-white" />} href="/writing" gradient="bg-success" />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="container pb-20">
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Connect & Explore</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Professional</h3>
              <p className="text-muted-foreground">
                Leader for National Security, AI Trust and Technology Risk at PwC.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Personal</h3>
              <p className="text-muted-foreground">Music enthusiast, vespa and motorcycle rider, and woodworking enthusiast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container pb-20">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>;
}