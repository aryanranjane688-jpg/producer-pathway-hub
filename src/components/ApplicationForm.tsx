import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  email: string;
  cooperativeName: string;
  aadhaarFile: File | null;
  landRecordFile: File | null;
}

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    cooperativeName: "",
    aadhaarFile: null,
    landRecordFile: null,
  });
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field: 'aadhaarFile' | 'landRecordFile', file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF files.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(field);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setFormData(prev => ({ ...prev, [field]: file }));
    setUploadingFile(null);
    
    toast({
      title: "File uploaded successfully",
      description: `${field === 'aadhaarFile' ? 'Aadhaar card' : 'Land record document'} uploaded.`,
    });
  };

  const handleSubmit = async () => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock applicant
    const applicant = {
      id: Date.now().toString(),
      ...formData,
      status: 'PENDING',
      submissionDate: new Date().toISOString(),
    };
    
    // Store in localStorage (mock database)
    const existingApplicants = JSON.parse(localStorage.getItem('applicants') || '[]');
    localStorage.setItem('applicants', JSON.stringify([...existingApplicants, applicant]));
    
    navigate('/application-success');
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = formData.fullName && formData.email && formData.cooperativeName;
  const isStep2Valid = formData.aadhaarFile && formData.landRecordFile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 2
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Progress value={(currentStep / 2) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>
              Personal Details
            </span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>
              Document Upload
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto card-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {currentStep === 1 ? "Personal Information" : "Upload Documents"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-base font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="cooperativeName" className="text-base font-medium">
                    Cooperative Name *
                  </Label>
                  <Input
                    id="cooperativeName"
                    value={formData.cooperativeName}
                    onChange={(e) => handleInputChange('cooperativeName', e.target.value)}
                    placeholder="Enter your cooperative name"
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Aadhaar Upload */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Aadhaar Card (PDF Only) *
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    {formData.aadhaarFile ? (
                      <div className="flex items-center justify-center gap-3 text-success">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">{formData.aadhaarFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          {uploadingFile === 'aadhaarFile' ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('aadhaarFile', file);
                          }}
                          className="hidden"
                          id="aadhaar-upload"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('aadhaar-upload')?.click()}
                          disabled={uploadingFile === 'aadhaarFile'}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Land Record Upload */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Land Record Document (PDF Only) *
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    {formData.landRecordFile ? (
                      <div className="flex items-center justify-center gap-3 text-success">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">{formData.landRecordFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          {uploadingFile === 'landRecordFile' ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('landRecordFile', file);
                          }}
                          className="hidden"
                          id="land-record-upload"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('land-record-upload')?.click()}
                          disabled={uploadingFile === 'landRecordFile'}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  uploadingFile !== null
                }
                className="flex items-center gap-2 gradient-primary text-primary-foreground"
              >
                {currentStep === 2 ? 'Submit Application' : 'Next'}
                {currentStep === 1 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;