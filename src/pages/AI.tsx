import { useState } from "react"
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Brain, MessageSquare, Target, Heart, Download, Youtube, Music } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { promptsData } from "@/data/ai-prompts"

export default function AI() {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Prompt copied!",
      description: "The prompt has been copied to your clipboard.",
    })
  }

  const exportPrompts = () => {
    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(promptsData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = 'ai-prompts.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } else {
      // CSV export
      let csvContent = "Category,Prompt,Usage\n"
      promptsData.categories.forEach(category => {
        category.prompts.forEach(prompt => {
          const escapedPrompt = `"${prompt.prompt.replace(/"/g, '""')}"`
          const escapedUsage = `"${prompt.usage.replace(/"/g, '""')}"`
          csvContent += `"${category.category}",${escapedPrompt},${escapedUsage}\n`
        })
      })
      
      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent)
      const exportFileDefaultName = 'ai-prompts.csv'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
    
    toast({
      title: "Export complete!",
      description: `Prompts exported as ${exportFormat.toUpperCase()} file.`,
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Productivity & Decision-Making":
        return <Target className="h-5 w-5" />
      case "Business Communication":
        return <MessageSquare className="h-5 w-5" />
      case "AI for Learning & Workflows":
        return <Brain className="h-5 w-5" />
      case "Personal Wellness & Reflection":
        return <Heart className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Productivity & Decision-Making":
        return "bg-blue-500/10 text-blue-600"
      case "Business Communication":
        return "bg-green-500/10 text-green-600"
      case "AI for Learning & Workflows":
        return "bg-purple-500/10 text-purple-600"
      case "Personal Wellness & Reflection":
        return "bg-rose-500/10 text-rose-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* SEO Optimized Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              AI Prompt Library & Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Practical AI prompts for business, learning, and reflection. Tested prompts you can copy and use 
              directly to enhance productivity, communication, and decision-making workflows.
            </p>
            
            {/* Export Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant={exportFormat === 'json' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportFormat('json')}
                >
                  JSON
                </Button>
                <Button
                  variant={exportFormat === 'csv' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportFormat('csv')}
                >
                  CSV
                </Button>
              </div>
              <Button onClick={exportPrompts} className="gap-2">
                <Download className="h-4 w-4" />
                Export Prompts
              </Button>
            </div>
          </div>

          {/* Introduction Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About This Library</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    AI works best when you give it a clear, focused prompt. This collection contains tested prompts 
                    for productivity, communication, learning, workflows, and personal wellness that you can copy and use directly.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <strong>Total prompts:</strong> {promptsData.categories.reduce((acc, cat) => acc + cat.prompts.length, 0)} • 
                    <strong> Categories:</strong> {promptsData.categories.length} • 
                    <strong> Last updated:</strong> {promptsData.metadata.lastUpdated}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    🤘 Community Resources
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    I also recommend exploring <strong>Sabrina Romanov's</strong> excellent AI agents and prompts database - 
                    the highest quality crowdsourced collection of AI agents and automations, 100% free forever.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://agents.sabrina.dev', '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      AI Agents Database
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://www.youtube.com/@sabrina_ramonov', '_blank')}
                      className="gap-2"
                    >
                      <Youtube className="h-3 w-3" />
                      YouTube
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://www.tiktok.com/@sabrina_ramonov', '_blank')}
                      className="gap-2"
                    >
                      <Music className="h-3 w-3" />
                      TikTok
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Categories */}
          <div className="space-y-8">
            {promptsData.categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category.category)}`}>
                      {getCategoryIcon(category.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{category.category}</h3>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.prompts.map((item, promptIndex) => (
                      <Card key={promptIndex} className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium text-foreground leading-relaxed">
                                "{item.prompt}"
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyPrompt(item.prompt)}
                              className="flex-shrink-0 hover:bg-primary/10"
                              title="Copy prompt"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            <strong>When to use:</strong> {item.usage}
                          </div>
                          
                          {item.tags && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Best Practices */}
          <Card className="mt-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader>
              <h3 className="text-xl font-semibold">Best Practices for AI Prompts</h3>
              <CardDescription>
                Tips for getting better results from AI tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Prompt Structure</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Be specific about the format you want (bullet points, table, paragraph)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Provide context about your role and the audience</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Include examples when you want a specific style or tone</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Optimization Tips</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Iterate and refine - AI responds well to follow-up questions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Test prompts with different AI models for comparison</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p>Save and organize successful prompts for reuse</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}