export interface AIPrompt {
  prompt: string
  usage: string
  tags?: string[]
}

export interface AIPromptCategory {
  category: string
  description: string
  prompts: AIPrompt[]
}

export interface AIPromptsData {
  metadata: {
    title: string
    description: string
    version: string
    lastUpdated: string
    author: string
  }
  categories: AIPromptCategory[]
}

export const promptsData: AIPromptsData = {
  metadata: {
    title: "AI Prompt Library - David Martin",
    description: "Practical AI prompts for business, learning, and reflection",
    version: "1.0.0",
    lastUpdated: "2025-01-20",
    author: "David Martin"
  },
  categories: [
    {
      category: "Productivity & Decision-Making",
      description: "Prompts for executive summaries, decision frameworks, and risk assessment",
      prompts: [
        {
          prompt: "Summarize this long memo into 3 bullet points that a senior leader can act on.",
          usage: "When you need to cut through detail and highlight the essentials for executives.",
          tags: ["executive", "summary", "leadership"]
        },
        {
          prompt: "Create a decision register entry with clear options, risks, and a recommendation.",
          usage: "To record business or risk decisions in a structured and auditable way.",
          tags: ["decision-making", "risk", "governance"]
        },
        {
          prompt: "Design a simple risk scoring model starting at 100 and adjusting up or down based on given factors.",
          usage: "When you want to quickly quantify risk or priority in a repeatable way.",
          tags: ["risk-assessment", "scoring", "quantification"]
        }
      ]
    },
    {
      category: "Business Communication",
      description: "Prompts for emails, meetings, and professional interactions",
      prompts: [
        {
          prompt: "Rewrite this email to make it clear, concise, and professional.",
          usage: "For improving tone and clarity in day-to-day correspondence.",
          tags: ["email", "communication", "professional"]
        },
        {
          prompt: "Turn this agenda into talking points for a meeting that keeps people engaged.",
          usage: "When preparing to lead or participate in a meeting.",
          tags: ["meetings", "facilitation", "engagement"]
        },
        {
          prompt: "Draft a short, thoughtful comment I can leave on a colleague's post to show support.",
          usage: "To build presence and strengthen professional relationships on social platforms.",
          tags: ["social-media", "networking", "support"]
        }
      ]
    },
    {
      category: "AI for Learning & Workflows",
      description: "Prompts for education, automation, and process improvement",
      prompts: [
        {
          prompt: "Explain this technical concept as if I am new to the field, then give me an advanced explanation.",
          usage: "When learning a new topic and wanting both beginner and expert views.",
          tags: ["learning", "education", "technical"]
        },
        {
          prompt: "Suggest five prompts I could use with Copilot (or another AI tool) to check if a new technology meets company standards.",
          usage: "To accelerate due diligence when exploring new tools.",
          tags: ["due-diligence", "technology", "standards"]
        },
        {
          prompt: "Describe a workflow where a form submission triggers an AI-generated analysis that is formatted for leadership review.",
          usage: "For mapping out automation ideas that combine AI and business processes.",
          tags: ["automation", "workflow", "analysis"]
        }
      ]
    },
    {
      category: "Personal Wellness & Reflection",
      description: "Prompts for mindfulness, routine building, and personal growth",
      prompts: [
        {
          prompt: "Write a short meditation script based on a simple phrase like 'Be still, and know that I am God'.",
          usage: "When you want to create space for reflection or grounding during the day.",
          tags: ["meditation", "mindfulness", "spirituality"]
        },
        {
          prompt: "Create a daily routine with a warm-up, focused work period, and wind-down that helps manage attention.",
          usage: "To build consistency and structure in your day, especially if you struggle with focus.",
          tags: ["routine", "focus", "productivity"]
        },
        {
          prompt: "Turn this reflection or journal entry into a structured set of takeaways I can act on.",
          usage: "When journaling or brainstorming and wanting to extract next steps.",
          tags: ["reflection", "journaling", "action-planning"]
        }
      ]
    }
  ]
}