import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  User, 
  Briefcase, 
  PenTool, 
  Music, 
  Heart, 
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Brain,
  Shield,
  Lightbulb,
  Users,
  ChevronDown,
  Play,
  Pause,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
  Calendar,
  Coffee
} from 'lucide-react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const navigation = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'about', label: 'About', icon: User },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'creative', label: 'Creative', icon: PenTool },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'coaching', label: 'Coaching', icon: Heart },
    { id: 'contact', label: 'Contact', icon: Mail }
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}>
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="text-xl font-semibold">David Martin</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeSection === item.id ? 'text-blue-600' : darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-2 mt-4">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Home Section */}
      <section id="home" className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Clarity.</span>
              <span className="block text-blue-600">Connection.</span>
              <span className="block">Risk with Purpose.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              David Martin helps leaders and teams make smarter decisions, navigate complexity, and build with intention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('about')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">About David</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 space-y-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">
                    I believe in the power of clear thinking, authentic connection, and purposeful risk-taking. 
                    My work sits at the intersection of technology, human behavior, and organizational resilience.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Currently serving as a Senior Manager at PwC, I focus on AI governance, technology risk management, 
                    and helping organizations navigate the complex landscape of emerging technologies. My approach combines 
                    analytical rigor with creative problem-solving and a deep commitment to ethical leadership.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Beyond the corporate world, I explore ideas through writing, music, and coaching conversations. 
                    I'm fascinated by the stories we tell ourselves, the systems we build, and the courage it takes 
                    to create meaningful change.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <Brain className="w-8 h-8 text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Strategic Thinking</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Connecting dots across complex systems and emerging patterns
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <Heart className="w-8 h-8 text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Authentic Leadership</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Leading with empathy, truth, and genuine care for outcomes
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Current Role</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Senior Manager</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">PwC Canada</p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Badge variant="secondary">AI Governance</Badge>
                        <Badge variant="secondary">Risk Management</Badge>
                        <Badge variant="secondary">Innovation Strategy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Core Values</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Clarity over complexity
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Truth over comfort
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Growth over perfection
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Connection over transaction
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Work & Expertise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <CardTitle>AI & Risk Governance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Developing frameworks for responsible AI deployment, risk assessment, and governance structures 
                    that balance innovation with ethical considerations.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">AI Ethics</Badge>
                    <Badge variant="outline">Risk Frameworks</Badge>
                    <Badge variant="outline">Governance Design</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    <CardTitle>Technology Risk Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Helping organizations identify, assess, and mitigate technology-related risks while enabling 
                    digital transformation and innovation initiatives.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Digital Risk</Badge>
                    <Badge variant="outline">Cybersecurity</Badge>
                    <Badge variant="outline">Compliance</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                    <CardTitle>Creative Frameworks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Building tools and methodologies that bridge analytical thinking with creative problem-solving, 
                    helping teams approach complex challenges with fresh perspectives.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Design Thinking</Badge>
                    <Badge variant="outline">Innovation Tools</Badge>
                    <Badge variant="outline">Prototyping</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <CardTitle>Advisory & Thought Leadership</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Providing strategic guidance to leadership teams on emerging technology trends, organizational 
                    resilience, and the human side of digital transformation.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Strategic Advisory</Badge>
                    <Badge variant="outline">Executive Coaching</Badge>
                    <Badge variant="outline">Change Management</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Current Focus Areas</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Exploring the intersection of AI governance, human-centered design, and organizational resilience. 
                    Particularly interested in how we can build systems that are both innovative and trustworthy.
                  </p>
                  <Button variant="outline" onClick={() => scrollToSection('contact')}>
                    Discuss a Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Section */}
      <section id="creative" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Creative Explorations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="w-5 h-5 mr-2 text-blue-600" />
                    Reflections & Essays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">On Uncertainty as a Feature</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        "We spend so much energy trying to eliminate uncertainty, but what if it's actually 
                        the space where innovation lives? What if the goal isn't to predict the future, 
                        but to build the capacity to dance with whatever emerges?"
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">Draft • November 2024</span>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">The Stories Systems Tell</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        "Every system embeds a story about how the world works. The question isn't whether 
                        our systems have values—it's whether we're conscious of what those values are."
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">Published • October 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Ideas in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/20">
                      <h4 className="font-medium mb-2">The Empathy-Analytics Bridge</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Exploring frameworks that help data-driven organizations maintain human connection 
                        and emotional intelligence in decision-making processes.
                      </p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-green-600 bg-green-50 dark:bg-green-900/20">
                      <h4 className="font-medium mb-2">Risk as Creative Constraint</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        How risk management principles can actually enhance creativity by providing 
                        structure and boundaries that enable more focused innovation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Dream Fragments & Observations</CardTitle>
                  <CardDescription>
                    Capturing moments of insight, overheard conversations, and the poetry of everyday complexity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm italic">
                      "The best meetings feel like jazz improvisation—everyone knows the structure, 
                      but magic happens in the spaces between the notes."
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm italic">
                      "Dreamed of a world where every algorithm came with a poet's commentary. 
                      Woke up wondering why this isn't already a thing."
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm italic">
                      "Overheard: 'We need to move fast and break things.' Underheard: 'But what if 
                      we moved thoughtfully and built things that last?'"
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Music & Sound</h2>
            
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Music has always been my way of processing complexity and finding patterns that words can't capture. 
                From jazz improvisation to alt-rock exploration, sound helps me think differently about everything else.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Compositions
                    <Music className="w-5 h-5 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">Uncertainty Variations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Piano • 3:42</p>
                      </div>
                      <Button size="sm" variant="outline" className="p-2">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">Systems Thinking Blues</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Guitar • 4:15</p>
                      </div>
                      <Button size="sm" variant="outline" className="p-2">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">Algorithmic Lullaby</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Mixed • 2:58</p>
                      </div>
                      <Button size="sm" variant="outline" className="p-2">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Musical Influences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Jazz Foundations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        The improvisational spirit of jazz informs how I approach problem-solving in all areas. 
                        There's something about working within structure while staying open to emergence.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Bill Evans</Badge>
                        <Badge variant="secondary">Keith Jarrett</Badge>
                        <Badge variant="secondary">Brad Mehldau</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Alternative & Experimental</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        The willingness to break conventional forms and explore new sonic territories. 
                        This experimental mindset carries over into how I think about innovation and risk.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Radiohead</Badge>
                        <Badge variant="secondary">Bon Iver</Badge>
                        <Badge variant="secondary">Thom Yorke</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Music as Thinking Tool</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    "Music teaches you to listen for patterns, to hold multiple rhythms simultaneously, 
                    and to find beauty in dissonance. These are exactly the skills we need for navigating 
                    complexity in any domain."
                  </p>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Listen on SoundCloud
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Section */}
      <section id="coaching" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Coaching & Connection</h2>
            
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Coaching, for me, is about creating space for authentic conversation and genuine growth. 
                It's not about having all the answers—it's about asking better questions and holding space for truth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-blue-600" />
                    How I Support Others
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">Creating safe spaces for difficult conversations and honest reflection</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">Helping leaders navigate the tension between analytical thinking and intuitive wisdom</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">Supporting individuals in finding their authentic voice and leadership style</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">Exploring the intersection of personal growth and professional effectiveness</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coffee className="w-5 h-5 mr-2 text-blue-600" />
                    What Coaching Looks Like
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Conversation, Not Consultation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        I believe in the power of dialogue. We explore questions together, and insights emerge 
                        from the space between us rather than from prescribed solutions.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Truth-Telling with Compassion</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Sometimes the most supportive thing is to gently challenge assumptions or point out 
                        patterns that might be invisible from the inside.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Integration Over Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The goal isn't to accumulate more knowledge but to integrate what you already know 
                        in ways that create sustainable change.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">An Invitation to Connect</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    If you're navigating a complex challenge, exploring a career transition, or simply want to think 
                    out loud with someone who listens deeply, I'd be honored to have that conversation with you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => scrollToSection('contact')}>
                      Start a Conversation
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a Call
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    These conversations are offered in the spirit of connection and mutual learning, not as commercial services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Get in Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-6">Let's Connect</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Whether you're interested in discussing a project, exploring ideas, or simply having a thoughtful 
                  conversation, I'd love to hear from you. I believe the best collaborations start with genuine connection.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span>david.martin@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Toronto, Canada</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">Connect Elsewhere</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                  <CardDescription>
                    I read every message personally and aim to respond within 48 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700"
                        placeholder="What's on your mind?"
                      ></textarea>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}>
                <span className="text-white font-bold">DM</span>
              </div>
              <span className="text-lg font-semibold">David Martin</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Clarity. Connection. Risk with Purpose.
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              {navigation.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              © 2024 David Martin. Built with intention and care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

