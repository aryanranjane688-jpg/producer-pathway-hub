import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto card-elevated">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Thank you for applying to join our producer network. Your application is now under review by our admin team.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Review Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team will review your application within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Email Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive updates about your application status via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-success-light p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-foreground">What happens next?</h3>
              </div>
              <ul className="text-sm text-muted-foreground text-left space-y-2">
                <li>• Document verification and validation</li>
                <li>• Background checks and cooperative verification</li>
                <li>• Admin approval and credential generation</li>
                <li>• Email notification with access credentials</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="px-8"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => navigate('/apply')}
                className="gradient-primary text-primary-foreground px-8"
              >
                Submit Another Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationSuccess;