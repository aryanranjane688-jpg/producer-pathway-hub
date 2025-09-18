import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Simple Application",
      description: "Easy multi-step form with document upload",
    },
    {
      icon: Shield,
      title: "Secure Process",
      description: "Protected document handling and verification",
    },
    {
      icon: CheckCircle,
      title: "Quick Review",
      description: "Fast approval process by our admin team",
    },
    {
      icon: Users,
      title: "Producer Network",
      description: "Join our trusted cooperative community",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ProducerHub</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/login')}
            className="text-muted-foreground border-border hover:bg-accent"
          >
            Admin Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Apply for
            <span className="block gradient-hero bg-clip-text text-transparent">
              Producer Access
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our trusted network of producers. Submit your application with required documents 
            and get approved to access exclusive cooperative benefits.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/apply')}
            className="text-lg px-8 py-6 gradient-primary text-primary-foreground hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Apply for Producer Access
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose ProducerHub?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined application process ensures quick and secure onboarding for all producers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-shadow hover:card-elevated transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="card-elevated gradient-hero">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
              The application process takes just a few minutes. Have your Aadhaar card 
              and land record documents ready.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/apply')}
              className="text-lg px-8 py-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              Start Your Application
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;