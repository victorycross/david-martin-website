import { Code, Palette, PenTool, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactForm } from "@/components/contact-form";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Hero Section */}
      <section className="container pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Welcome
          </p>
          <h1 className="text-5xl md:text-6xl font-playfair font-normal mb-8 leading-tight text-[#2C2C2C]">
            Create. Build. Write.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            I'm David Martin — leader in AI governance, technology risk, 
            and creative exploration at the intersection of art and innovation.
          </p>
        </div>

        {/* Three Panel Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link to="/creative" className="group">
            <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-lg bg-[#5B7B6D] flex items-center justify-center mb-6">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair mb-3 text-[#2C2C2C]">Create</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Explore my creative journey through music, visual art, and family history archives.
              </p>
              <span className="text-[#5B7B6D] text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
          
          <Link to="/technology" className="group">
            <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-lg bg-[#5B7B6D] flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair mb-3 text-[#2C2C2C]">Build</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Discover AI tools, risk frameworks, and practical solutions for real-world challenges.
              </p>
              <span className="text-[#5B7B6D] text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
          
          <Link to="/writing" className="group">
            <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-lg bg-[#5B7B6D] flex items-center justify-center mb-6">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair mb-3 text-[#2C2C2C]">Write</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Read thoughts on technology risk, AI governance, and insights from financial services.
              </p>
              <span className="text-[#5B7B6D] text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="container pb-20">
        <div className="bg-white rounded-xl p-10 max-w-3xl mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E3]">
          <h2 className="text-2xl font-playfair text-center mb-8 text-[#2C2C2C]">About</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-[#5B7B6D] mb-2">Professional</p>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Leader for National Security, AI Trust and Technology Risk at PwC.
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-[#5B7B6D] mb-2">Personal</p>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Music enthusiast, vespa rider, and woodworking hobbyist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container pb-24">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
