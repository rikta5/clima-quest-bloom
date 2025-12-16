import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  MapPin, 
  Award, 
  ExternalLink, 
  Mail, 
  ArrowLeft,
  Database,
  Send,
  Globe,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { getCompanyById } from "@/config/companies";
import { toast } from "sonner";

const CompanyProfile = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = companyId ? getCompanyById(companyId) : undefined;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! The company will respond within 48 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  if (!company) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The company you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/companies')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/companies')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </Button>

        {/* Company Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-xl bg-white shadow-lg flex items-center justify-center">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {company.name}
                  </h1>
                  {company.esgScore && (
                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 text-lg px-3 py-1">
                      <Award className="w-4 h-4 mr-1" />
                      ESG {company.esgScore}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <Badge variant="secondary">{company.industry}</Badge>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {company.website && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(company.website, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {company.contactEmail && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${company.contactEmail}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  About the Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {company.description}
                </p>
              </CardContent>
            </Card>

            {/* Contributed Datasets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Contributed Datasets
                </CardTitle>
                <CardDescription>
                  Environmental and climate data shared for educational purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {company.contributedDatasets.map((dataset) => (
                    <div 
                      key={dataset} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">
                            {dataset.replace('-', ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Climate education dataset
                          </div>
                        </div>
                      </div>
                      <Link to={`/topic/${dataset}`}>
                        <Button variant="ghost" size="sm">
                          Explore
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ESG Commitment */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  ESG Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {company.shortName} demonstrates its commitment to Environmental, Social, and Governance 
                  principles by making its data transparent and accessible through educational platforms.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {company.esgScore}
                    </div>
                    <div className="text-xs text-muted-foreground">ESG Score</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {company.contributedDatasets.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Datasets</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-orange mb-1">
                      100%
                    </div>
                    <div className="text-xs text-muted-foreground">Transparent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Contact Company
                </CardTitle>
                <CardDescription>
                  Send a message to {company.shortName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Question about your ESG data"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    The company will respond within 48 hours
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyProfile;

