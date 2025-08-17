import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Save, 
  Edit, 
  Plus, 
  Trash2, 
  Upload, 
  Eye, 
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Settings,
  Github,
  Key,
  Wifi,
  WifiOff,
  Shield,
  Clock,
  User
} from 'lucide-react'
import githubService from '../services/githubService.js'
import secureAuth from '../services/secureAuthService.js'

const AdminPanel = ({ onUpdateContent, initialData = {} }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [saveStatus, setSaveStatus] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [formData, setFormData] = useState({
    home: {
      title: 'Clarity. Connection. Risk with Purpose.',
      subtitle: 'David Martin helps leaders and teams make smarter decisions, navigate complexity, and build with intention.',
      heroLines: ['Clarity.', 'Connection.', 'Risk with Purpose.']
    },
    about: {
      title: 'About David',
      bio: [
        'I believe in the power of clear thinking, authentic connection, and purposeful risk-taking. My work sits at the intersection of technology, human behavior, and organizational resilience.',
        'Currently serving as a Senior Manager at PwC, I focus on AI governance, technology risk management, and helping organizations navigate the complex landscape of emerging technologies. My approach combines analytical rigor with creative problem-solving and a deep commitment to ethical leadership.',
        'Beyond the corporate world, I explore ideas through writing, music, and coaching conversations. I\'m fascinated by the stories we tell ourselves, the systems we build, and the courage it takes to create meaningful change.'
      ],
      currentRole: 'Senior Manager',
      company: 'PwC Canada',
      skills: ['AI Governance', 'Risk Management', 'Innovation Strategy'],
      values: [
        'Clarity over complexity',
        'Truth over comfort', 
        'Growth over perfection',
        'Connection over transaction'
      ]
    },
    work: {
      title: 'Work & Expertise',
      focusAreas: 'Exploring the intersection of AI governance, human-centered design, and organizational resilience. Particularly interested in how we can build systems that are both innovative and trustworthy.',
      services: [
        {
          title: 'AI & Risk Governance',
          description: 'Developing frameworks for responsible AI deployment, risk assessment, and governance structures that balance innovation with ethical considerations.',
          tags: ['AI Ethics', 'Risk Frameworks', 'Governance Design']
        },
        {
          title: 'Technology Risk Management', 
          description: 'Helping organizations identify, assess, and mitigate technology-related risks while enabling digital transformation and innovation initiatives.',
          tags: ['Digital Risk', 'Cybersecurity', 'Compliance']
        },
        {
          title: 'Creative Frameworks',
          description: 'Building tools and methodologies that bridge analytical thinking with creative problem-solving, helping teams approach complex challenges with fresh perspectives.',
          tags: ['Design Thinking', 'Innovation Tools', 'Prototyping']
        },
        {
          title: 'Advisory & Thought Leadership',
          description: 'Providing strategic guidance to leadership teams on emerging technology trends, organizational resilience, and the human side of digital transformation.',
          tags: ['Strategic Advisory', 'Executive Coaching', 'Change Management']
        }
      ]
    },
    creative: {
      title: 'Creative Explorations',
      essays: [
        {
          title: 'On Uncertainty as a Feature',
          excerpt: 'We spend so much energy trying to eliminate uncertainty, but what if it\'s actually the space where innovation lives? What if the goal isn\'t to predict the future, but to build the capacity to dance with whatever emerges?',
          status: 'Draft',
          date: 'November 2024'
        },
        {
          title: 'The Stories Systems Tell',
          excerpt: 'Every system embeds a story about how the world works. The question isn\'t whether our systems have values—it\'s whether we\'re conscious of what those values are.',
          status: 'Published',
          date: 'October 2024'
        }
      ],
      ideasInProgress: [
        {
          title: 'The Empathy-Analytics Bridge',
          description: 'Exploring frameworks that help data-driven organizations maintain human connection and emotional intelligence in decision-making processes.'
        },
        {
          title: 'Risk as Creative Constraint',
          description: 'How risk management principles can actually enhance creativity by providing structure and boundaries that enable more focused innovation.'
        }
      ],
      observations: [
        'The best meetings feel like jazz improvisation—everyone knows the structure, but magic happens in the spaces between the notes.',
        'Dreamed of a world where every algorithm came with a poet\'s commentary. Woke up wondering why this isn\'t already a thing.',
        'Overheard: \'We need to move fast and break things.\' Underheard: \'But what if we moved thoughtfully and built things that last?\''
      ]
    },
    music: {
      title: 'Music & Sound',
      description: 'Music has always been my way of processing complexity and finding patterns that words can\'t capture. From jazz improvisation to alt-rock exploration, sound helps me think differently about everything else.',
      compositions: [
        { title: 'Uncertainty Variations', instrument: 'Piano', duration: '3:42' },
        { title: 'Systems Thinking Blues', instrument: 'Guitar', duration: '4:15' },
        { title: 'Algorithmic Lullaby', instrument: 'Mixed', duration: '2:58' }
      ],
      influences: {
        jazz: {
          description: 'The improvisational spirit of jazz informs how I approach problem-solving in all areas. There\'s something about working within structure while staying open to emergence.',
          artists: ['Bill Evans', 'Keith Jarrett', 'Brad Mehldau']
        },
        alternative: {
          description: 'The willingness to break conventional forms and explore new sonic territories. This experimental mindset carries over into how I think about innovation and risk.',
          artists: ['Radiohead', 'Bon Iver', 'Thom Yorke']
        }
      },
      philosophy: 'Music teaches you to listen for patterns, to hold multiple rhythms simultaneously, and to find beauty in dissonance. These are exactly the skills we need for navigating complexity in any domain.'
    },
    coaching: {
      title: 'Coaching & Connection',
      description: 'Coaching, for me, is about creating space for authentic conversation and genuine growth. It\'s not about having all the answers—it\'s about asking better questions and holding space for truth.',
      approach: [
        'Creating safe spaces for difficult conversations and honest reflection',
        'Helping leaders navigate the tension between analytical thinking and intuitive wisdom',
        'Supporting individuals in finding their authentic voice and leadership style',
        'Exploring the intersection of personal growth and professional effectiveness'
      ],
      philosophy: {
        conversation: 'I believe in the power of dialogue. We explore questions together, and insights emerge from the space between us rather than from prescribed solutions.',
        truthTelling: 'Sometimes the most supportive thing is to gently challenge assumptions or point out patterns that might be invisible from the inside.',
        integration: 'The goal isn\'t to accumulate more knowledge but to integrate what you already know in ways that create sustainable change.'
      },
      invitation: 'If you\'re navigating a complex challenge, exploring a career transition, or simply want to think out loud with someone who listens deeply, I\'d be honored to have that conversation with you.'
    },
    contact: {
      title: 'Get in Touch',
      description: 'Whether you\'re interested in discussing a project, exploring ideas, or simply having a thoughtful conversation, I\'d love to hear from you. I believe the best collaborations start with genuine connection.',
      email: 'david.martin@example.com',
      location: 'Toronto, Canada',
      responseTime: 'I read every message personally and aim to respond within 48 hours.',
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/davidmartin' },
        { platform: 'Twitter', url: 'https://twitter.com/davidmartin' }
      ]
    }
  })

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (secureAuth.isAuthenticated()) {
        setIsAuthenticated(true)
        setCurrentUser(secureAuth.getCurrentUser())
        
        // Set up GitHub service with the token
        const token = secureAuth.getAccessToken()
        githubService.setToken(token)
        
        // Load current content from GitHub
        try {
          const contentFile = await githubService.getContentFile()
          setFormData(contentFile.content)
        } catch (error) {
          console.warn('Could not load content from GitHub, using default data')
        }
      }
    }

    checkAuth()
  }, [])

  const handleAuth = async () => {
    if (!authToken.trim()) {
      setSaveStatus('error:Please enter your GitHub Personal Access Token')
      return
    }

    setLoading(true)
    setSaveStatus('')
    
    try {
      const result = await secureAuth.authenticate(authToken.trim())
      
      if (result.success) {
        setIsAuthenticated(true)
        setCurrentUser(result.user)
        
        // Set up GitHub service with the token
        githubService.setToken(authToken.trim())
        
        // Load current content from GitHub
        try {
          const contentFile = await githubService.getContentFile()
          setFormData(contentFile.content)
          setSaveStatus('success:Authentication successful! Content loaded from GitHub.')
        } catch (error) {
          setSaveStatus('success:Authentication successful! Using default content.')
        }
        
        setAuthToken('') // Clear token from state for security
      }
    } catch (error) {
      setSaveStatus(`error:${error.message}`)
    } finally {
      setLoading(false)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const handleLogout = () => {
    secureAuth.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setAuthToken('')
    setSaveStatus('')
  }

  const handleSave = async (section) => {
    setSaveStatus('saving')
    console.log('Starting save for section:', section)
    
    try {
      if (isAuthenticated) {
        console.log('User is authenticated, attempting GitHub save...')
        
        // First test GitHub connection
        const token = secureAuth.getAccessToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        
        console.log('Token available, updating section:', section)
        
        // Save to GitHub repository
        await githubService.updateSection(section, formData[section])
        console.log('Save successful!')
        
        setSaveStatus('success:Changes saved and deployed to GitHub!')
        
        // Trigger GitHub Pages deployment (automatic on push)
        setTimeout(async () => {
          try {
            await githubService.triggerDeployment()
          } catch (error) {
            console.warn('Deployment trigger failed:', error)
          }
        }, 1000)
      } else {
        console.log('User not authenticated, saving locally')
        // Fallback to local callback
        if (onUpdateContent) {
          onUpdateContent(section, formData[section])
        }
        setSaveStatus('success:Changes saved locally (not authenticated)')
      }
      
      setTimeout(() => setSaveStatus(''), 5000)
    } catch (error) {
      console.error('Save error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        section: section,
        isAuthenticated: isAuthenticated
      })
      
      setSaveStatus(`error:Failed to save changes - ${error.message}`)
      setTimeout(() => setSaveStatus(''), 8000)
    }
  }


  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev }
      if (index !== null) {
        if (!Array.isArray(newData[section][field])) {
          newData[section][field] = []
        }
        newData[section][field][index] = value
      } else {
        newData[section][field] = value
      }
      return newData
    })
  }

  const addArrayItem = (section, field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section][field] || []), newItem]
      }
    }))
  }

  const removeArrayItem = (section, field, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }))
  }

  if (!isAuthenticated) {
    const instructions = secureAuth.getTokenInstructions()
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle>Secure Admin Access</CardTitle>
            <CardDescription>
              Authenticate with your GitHub Personal Access Token for secure repository access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showInstructions ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="auth-token">GitHub Personal Access Token</Label>
                  <Input
                    id="auth-token"
                    type="password"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Enter your GitHub Personal Access Token with 'repo' permissions
                  </p>
                </div>
                
                {saveStatus.startsWith('error:') && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {saveStatus.split(':')[1]}
                    </AlertDescription>
                  </Alert>
                )}
                
                {saveStatus.startsWith('success:') && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {saveStatus.split(':')[1]}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleAuth} 
                    disabled={loading || !authToken.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Settings className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4 mr-2" />
                        Authenticate
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInstructions(true)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Need Token?
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p><strong>{instructions.title}:</strong></p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {instructions.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Security Features:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {instructions.security.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowInstructions(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Website Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage content for davidmartin.dev
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {saveStatus === 'saving' && (
                <Badge variant="secondary">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </Badge>
              )}
              {saveStatus.startsWith('success:') && (
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {saveStatus.split(':')[1]}
                </Badge>
              )}
              {saveStatus.startsWith('error:') && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {saveStatus.split(':')[1]}
                </Badge>
              )}
              
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Authenticated
                </Badge>
                {currentUser && (
                  <Badge variant="secondary">
                    <User className="w-3 h-3 mr-1" />
                    {currentUser.login}
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <Lock className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="coaching">Coaching</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Home Section */}
          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Home Section</CardTitle>
                <CardDescription>
                  Manage the hero section and main landing page content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="home-title">Main Title</Label>
                  <Input
                    id="home-title"
                    value={formData.home.title}
                    onChange={(e) => handleInputChange('home', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="home-subtitle">Subtitle</Label>
                  <Textarea
                    id="home-subtitle"
                    value={formData.home.subtitle}
                    onChange={(e) => handleInputChange('home', 'subtitle', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Hero Lines</Label>
                  <div className="space-y-2 mt-1">
                    {formData.home.heroLines.map((line, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={line}
                          onChange={(e) => handleInputChange('home', 'heroLines', e.target.value, index)}
                          placeholder={`Hero line ${index + 1}`}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('home', 'heroLines', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('home', 'heroLines', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Hero Line
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('home')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Home Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>
                  Manage personal bio, current role, and core values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Section Title</Label>
                  <Input
                    id="about-title"
                    value={formData.about.title}
                    onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Bio Paragraphs</Label>
                  <div className="space-y-3 mt-1">
                    {formData.about.bio.map((paragraph, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Paragraph {index + 1}</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('about', 'bio', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={paragraph}
                          onChange={(e) => handleInputChange('about', 'bio', e.target.value, index)}
                          rows={4}
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('about', 'bio', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bio Paragraph
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current-role">Current Role</Label>
                    <Input
                      id="current-role"
                      value={formData.about.currentRole}
                      onChange={(e) => handleInputChange('about', 'currentRole', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.about.company}
                      onChange={(e) => handleInputChange('about', 'company', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Skills & Expertise</Label>
                  <div className="space-y-2 mt-1">
                    {formData.about.skills.map((skill, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleInputChange('about', 'skills', e.target.value, index)}
                          placeholder="Skill or expertise area"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('about', 'skills', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('about', 'skills', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Core Values</Label>
                  <div className="space-y-2 mt-1">
                    {formData.about.values.map((value, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={value}
                          onChange={(e) => handleInputChange('about', 'values', e.target.value, index)}
                          placeholder="Core value"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('about', 'values', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('about', 'values', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Value
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('about')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save About Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Section */}
          <TabsContent value="work" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work & Expertise</CardTitle>
                <CardDescription>
                  Manage professional services and focus areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="work-title">Section Title</Label>
                  <Input
                    id="work-title"
                    value={formData.work.title}
                    onChange={(e) => handleInputChange('work', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="focus-areas">Current Focus Areas</Label>
                  <Textarea
                    id="focus-areas"
                    value={formData.work.focusAreas}
                    onChange={(e) => handleInputChange('work', 'focusAreas', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Separator />

                <div>
                  <Label>Services</Label>
                  <div className="space-y-4 mt-1">
                    {formData.work.services.map((service, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Label className="text-sm font-medium">Service {index + 1}</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('work', 'services', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={service.title}
                            onChange={(e) => {
                              const newService = { ...service, title: e.target.value }
                              handleInputChange('work', 'services', newService, index)
                            }}
                            placeholder="Service title"
                          />
                          <Textarea
                            value={service.description}
                            onChange={(e) => {
                              const newService = { ...service, description: e.target.value }
                              handleInputChange('work', 'services', newService, index)
                            }}
                            placeholder="Service description"
                            rows={3}
                          />
                          <div>
                            <Label className="text-sm">Tags (comma-separated)</Label>
                            <Input
                              value={service.tags?.join(', ') || ''}
                              onChange={(e) => {
                                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                const newService = { ...service, tags }
                                handleInputChange('work', 'services', newService, index)
                              }}
                              placeholder="tag1, tag2, tag3"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={() => addArrayItem('work', 'services', { title: '', description: '', tags: [] })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('work')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Work Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Creative Section */}
          <TabsContent value="creative" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Creative Explorations</CardTitle>
                <CardDescription>
                  Manage essays, ideas in progress, and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="creative-title">Section Title</Label>
                  <Input
                    id="creative-title"
                    value={formData.creative.title}
                    onChange={(e) => handleInputChange('creative', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Separator />

                <div>
                  <Label>Essays</Label>
                  <div className="space-y-4 mt-1">
                    {formData.creative.essays.map((essay, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Label className="text-sm font-medium">Essay {index + 1}</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('creative', 'essays', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={essay.title}
                            onChange={(e) => {
                              const newEssay = { ...essay, title: e.target.value }
                              handleInputChange('creative', 'essays', newEssay, index)
                            }}
                            placeholder="Essay title"
                          />
                          <Textarea
                            value={essay.excerpt}
                            onChange={(e) => {
                              const newEssay = { ...essay, excerpt: e.target.value }
                              handleInputChange('creative', 'essays', newEssay, index)
                            }}
                            placeholder="Essay excerpt"
                            rows={3}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={essay.status}
                              onChange={(e) => {
                                const newEssay = { ...essay, status: e.target.value }
                                handleInputChange('creative', 'essays', newEssay, index)
                              }}
                              placeholder="Status (Draft/Published)"
                            />
                            <Input
                              value={essay.date}
                              onChange={(e) => {
                                const newEssay = { ...essay, date: e.target.value }
                                handleInputChange('creative', 'essays', newEssay, index)
                              }}
                              placeholder="Date"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={() => addArrayItem('creative', 'essays', { title: '', excerpt: '', status: 'Draft', date: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Essay
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Ideas in Progress</Label>
                  <div className="space-y-4 mt-1">
                    {formData.creative.ideasInProgress.map((idea, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Label className="text-sm font-medium">Idea {index + 1}</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('creative', 'ideasInProgress', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={idea.title}
                            onChange={(e) => {
                              const newIdea = { ...idea, title: e.target.value }
                              handleInputChange('creative', 'ideasInProgress', newIdea, index)
                            }}
                            placeholder="Idea title"
                          />
                          <Textarea
                            value={idea.description}
                            onChange={(e) => {
                              const newIdea = { ...idea, description: e.target.value }
                              handleInputChange('creative', 'ideasInProgress', newIdea, index)
                            }}
                            placeholder="Idea description"
                            rows={3}
                          />
                        </div>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={() => addArrayItem('creative', 'ideasInProgress', { title: '', description: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Idea
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Observations</Label>
                  <div className="space-y-2 mt-1">
                    {formData.creative.observations.map((observation, index) => (
                      <div key={index} className="flex space-x-2">
                        <Textarea
                          value={observation}
                          onChange={(e) => handleInputChange('creative', 'observations', e.target.value, index)}
                          placeholder="Observation or thought"
                          rows={2}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('creative', 'observations', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('creative', 'observations', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Observation
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('creative')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Creative Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Section */}
          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Music & Sound</CardTitle>
                <CardDescription>
                  Manage music content, compositions, and influences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="music-title">Section Title</Label>
                  <Input
                    id="music-title"
                    value={formData.music.title}
                    onChange={(e) => handleInputChange('music', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="music-description">Description</Label>
                  <Textarea
                    id="music-description"
                    value={formData.music.description}
                    onChange={(e) => handleInputChange('music', 'description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Separator />

                <div>
                  <Label>Compositions</Label>
                  <div className="space-y-4 mt-1">
                    {formData.music.compositions.map((composition, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Label className="text-sm font-medium">Composition {index + 1}</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('music', 'compositions', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            value={composition.title}
                            onChange={(e) => {
                              const newComposition = { ...composition, title: e.target.value }
                              handleInputChange('music', 'compositions', newComposition, index)
                            }}
                            placeholder="Title"
                          />
                          <Input
                            value={composition.instrument}
                            onChange={(e) => {
                              const newComposition = { ...composition, instrument: e.target.value }
                              handleInputChange('music', 'compositions', newComposition, index)
                            }}
                            placeholder="Instrument"
                          />
                          <Input
                            value={composition.duration}
                            onChange={(e) => {
                              const newComposition = { ...composition, duration: e.target.value }
                              handleInputChange('music', 'compositions', newComposition, index)
                            }}
                            placeholder="Duration"
                          />
                        </div>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={() => addArrayItem('music', 'compositions', { title: '', instrument: '', duration: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Composition
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="music-philosophy">Music Philosophy</Label>
                  <Textarea
                    id="music-philosophy"
                    value={formData.music.philosophy}
                    onChange={(e) => handleInputChange('music', 'philosophy', e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('music')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Music Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaching Section */}
          <TabsContent value="coaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coaching & Connection</CardTitle>
                <CardDescription>
                  Manage coaching approach, philosophy, and invitation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coaching-title">Section Title</Label>
                  <Input
                    id="coaching-title"
                    value={formData.coaching.title}
                    onChange={(e) => handleInputChange('coaching', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="coaching-description">Description</Label>
                  <Textarea
                    id="coaching-description"
                    value={formData.coaching.description}
                    onChange={(e) => handleInputChange('coaching', 'description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Separator />

                <div>
                  <Label>Coaching Approach</Label>
                  <div className="space-y-2 mt-1">
                    {formData.coaching.approach.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <Textarea
                          value={item}
                          onChange={(e) => handleInputChange('coaching', 'approach', e.target.value, index)}
                          placeholder="Approach item"
                          rows={2}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('coaching', 'approach', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('coaching', 'approach', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Approach Item
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Philosophy</Label>
                  <div className="space-y-4 mt-1">
                    <div>
                      <Label className="text-sm">Conversation Philosophy</Label>
                      <Textarea
                        value={formData.coaching.philosophy.conversation}
                        onChange={(e) => handleInputChange('coaching', 'philosophy', { ...formData.coaching.philosophy, conversation: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Truth Telling Philosophy</Label>
                      <Textarea
                        value={formData.coaching.philosophy.truthTelling}
                        onChange={(e) => handleInputChange('coaching', 'philosophy', { ...formData.coaching.philosophy, truthTelling: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Integration Philosophy</Label>
                      <Textarea
                        value={formData.coaching.philosophy.integration}
                        onChange={(e) => handleInputChange('coaching', 'philosophy', { ...formData.coaching.philosophy, integration: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="coaching-invitation">Invitation Message</Label>
                  <Textarea
                    id="coaching-invitation"
                    value={formData.coaching.invitation}
                    onChange={(e) => handleInputChange('coaching', 'invitation', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('coaching')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Coaching Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Manage contact details and social links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-title">Section Title</Label>
                  <Input
                    id="contact-title"
                    value={formData.contact.title}
                    onChange={(e) => handleInputChange('contact', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-description">Description</Label>
                  <Textarea
                    id="contact-description"
                    value={formData.contact.description}
                    onChange={(e) => handleInputChange('contact', 'description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.contact.location}
                      onChange={(e) => handleInputChange('contact', 'location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="response-time">Response Time Message</Label>
                  <Input
                    id="response-time"
                    value={formData.contact.responseTime}
                    onChange={(e) => handleInputChange('contact', 'responseTime', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Social Links</Label>
                  <div className="space-y-2 mt-1">
                    {formData.contact.socialLinks.map((link, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={link.platform}
                          onChange={(e) => {
                            const newLink = { ...link, platform: e.target.value }
                            handleInputChange('contact', 'socialLinks', newLink, index)
                          }}
                          placeholder="Platform name"
                          className="flex-1"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLink = { ...link, url: e.target.value }
                            handleInputChange('contact', 'socialLinks', newLink, index)
                          }}
                          placeholder="URL"
                          className="flex-2"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('contact', 'socialLinks', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('contact', 'socialLinks', { platform: '', url: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social Link
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('contact')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Contact Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Deployment</CardTitle>
            <CardDescription>
              Publish changes to your live website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Changes are automatically saved and will be deployed to GitHub Pages.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Deploy to Live Site
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPanel