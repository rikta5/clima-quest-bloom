import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Award, ExternalLink, Mail, TrendingUp } from "lucide-react";
import { companies } from "@/config/companies";
import { Link } from "react-router-dom";

const Companies = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2">
            <Building2 className="w-4 h-4" />
            <span>ESG Partners</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Contributing Companies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the companies making their ESG data transparent through education. 
            These organizations are committed to environmental responsibility and community engagement.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{companies.length}</div>
                  <div className="text-sm text-muted-foreground">Partner Companies</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {companies.reduce((sum, c) => sum + c.contributedDatasets.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Datasets Contributed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange/5 border-orange/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-orange" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(companies.reduce((sum, c) => sum + (c.esgScore || 0), 0) / companies.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. ESG Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {companies.map((company) => (
            <Card 
              key={company.id} 
              className="overflow-hidden hover:shadow-eco-lg transition-all group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  {company.esgScore && (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      <Award className="w-3 h-3 mr-1" />
                      ESG {company.esgScore}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  {company.shortName}
                </CardTitle>
                
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3" />
                  {company.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {company.industry}
                  </Badge>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {company.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                    Contributed Datasets
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.contributedDatasets.map((dataset) => (
                      <Badge key={dataset} variant="outline" className="text-xs">
                        {dataset.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/company/${company.id}`} className="flex-1">
                    <Button variant="default" className="w-full" size="sm">
                      View Profile
                    </Button>
                  </Link>
                  
                  {company.website && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(company.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Is Your Company Committed to Transparency?
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our platform and transform your ESG data into engaging educational content. 
                Build trust with your community through transparency.
              </p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Mail className="w-4 h-4 mr-2" />
                  Partner With Us
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Companies;

