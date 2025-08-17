import { useState, useEffect } from 'react';

const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/david-martin-website/src/data/content.json');
        
        if (!response.ok) {
          throw new Error('Failed to load content');
        }
        
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.warn('Failed to load dynamic content, using fallback:', err);
        // Fallback content structure
        setContent({
          home: {
            title: "Clarity. Connection. Risk with Purpose.",
            subtitle: "David Martin helps leaders and teams make smarter decisions, navigate complexity, and build with intention.",
            heroLines: ["Clarity.", "Connection.", "Risk with Purpose."]
          },
          about: {
            title: "About David",
            bio: [
              "I believe in the power of clear thinking, authentic connection, and purposeful risk-taking. My work sits at the intersection of technology, human behavior, and organizational resilience.",
              "Currently serving as a Senior Manager at PwC, I focus on AI governance, technology risk management, and helping organizations navigate the complex landscape of emerging technologies. My approach combines analytical rigor with creative problem-solving and a deep commitment to ethical leadership.",
              "Beyond the corporate world, I explore ideas through writing, music, and coaching conversations. I'm fascinated by the stories we tell ourselves, the systems we build, and the courage it takes to create meaningful change."
            ],
            currentRole: "Senior Manager",
            company: "PwC Canada",
            skills: ["AI Governance", "Risk Management", "Innovation Strategy"],
            values: [
              "Clarity over complexity",
              "Truth over comfort", 
              "Growth over perfection",
              "Connection over transaction"
            ]
          },
          // Add other fallback sections as needed
        });
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return { content, loading, error };
};

export default useContent;