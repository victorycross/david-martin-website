import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

export default function TechRiskSection() {
  const riskFrameworks = [
    {
      title: "AI Implementation Risk Assessment",
      description: "Structured approach for evaluating AI deployment risks in enterprise environments",
      status: "In Development",
      riskFactors: ["Data Privacy", "Model Bias", "Regulatory Compliance", "Operational Dependencies"],
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Technology Due Diligence Framework",
      description: "Comprehensive checklist for evaluating new technology investments and vendor partnerships",
      status: "Active Use",
      riskFactors: ["Security Assessment", "Scalability Analysis", "Vendor Stability", "Integration Complexity"],
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      title: "Digital Transformation Risk Registry",
      description: "Living document tracking risks and mitigation strategies for large-scale technology changes",
      status: "Template",
      riskFactors: ["Change Management", "Technical Debt", "Resource Allocation", "Timeline Risks"],
      icon: <Clock className="h-6 w-6" />
    }
  ]

  const riskPrinciples = [
    {
      principle: "Risk-Based Decision Making",
      description: "Every technology decision should include explicit risk assessment and mitigation planning",
      importance: "High"
    },
    {
      principle: "Continuous Monitoring",
      description: "Technology risks evolve - regular reassessment ensures controls remain effective",
      importance: "High"
    },
    {
      principle: "Stakeholder Alignment",
      description: "Risk tolerance and mitigation strategies must be clearly communicated to all stakeholders",
      importance: "Medium"
    },
    {
      principle: "Documentation & Learning",
      description: "Risk decisions and outcomes should be documented to improve future assessments",
      importance: "Medium"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Use':
        return 'border-success text-success'
      case 'In Development':
        return 'border-warning text-warning'
      case 'Template':
        return 'border-muted-foreground text-muted-foreground'
      default:
        return 'border-muted-foreground text-muted-foreground'
    }
  }

  const getImportanceColor = (importance: string) => {
    return importance === 'High' ? 'bg-red-500/10 text-red-600' : 'bg-yellow-500/10 text-yellow-600'
  }

  return (
    <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-500/10 p-2 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Technology Risk Management</h3>
            <CardDescription className="text-base">
              Frameworks and approaches for identifying, assessing, and mitigating technology risks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-4 bg-white/10 rounded-lg">
          <p className="text-muted-foreground leading-relaxed">
            Technology risk management is about making informed decisions in uncertain environments. 
            These frameworks help structure thinking around technology investments, implementations, and ongoing operations.
          </p>
        </div>

        {/* Risk Frameworks */}
        <div className="space-y-6 mb-8">
          <h4 className="text-xl font-semibold mb-4">Risk Assessment Frameworks</h4>
          
          {riskFrameworks.map((framework, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  {framework.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-lg font-semibold">{framework.title}</h5>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(framework.status)}
                    >
                      {framework.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {framework.description}
                  </p>
                </div>
              </div>

              <div>
                <h6 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                  Key Risk Areas
                </h6>
                <div className="flex flex-wrap gap-2">
                  {framework.riskFactors.map((factor) => (
                    <Badge key={factor} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Risk Principles */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold mb-4">Core Risk Management Principles</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {riskPrinciples.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className="font-semibold">{item.principle}</h5>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getImportanceColor(item.importance)}`}
                  >
                    {item.importance}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-white/5 rounded-lg">
          <h4 className="font-semibold mb-3 text-lg">Risk Assessment Approach</h4>
          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Identify:</strong> What technology risks could impact your objectives?</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Assess:</strong> What's the likelihood and impact of each risk?</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Mitigate:</strong> What controls can reduce risk to acceptable levels?</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Monitor:</strong> How will you track risk levels and control effectiveness?</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}