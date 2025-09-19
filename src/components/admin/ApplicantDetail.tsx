import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  User, 
  Mail, 
  Building2,
  Calendar,
  ExternalLink,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { applicationService } from "@/lib/firebaseService";
import { Application } from "@/types/application";

interface Credentials {
  username: string;
  password: string;
}

const ApplicantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadApplicant();
  }, [id, navigate]);

  const loadApplicant = async () => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      const foundApplicant = await applicationService.getApplicationById(id);
      
      if (!foundApplicant) {
        toast({
          title: "Applicant not found",
          description: "The requested applicant could not be found.",
          variant: "destructive",
        });
        navigate('/admin/dashboard');
        return;
      }
      
      setApplicant(foundApplicant);
    } catch (error) {
      console.error('Error loading applicant:', error);
      toast({
        title: "Error loading applicant",
        description: "Failed to load applicant details. Please try again.",
        variant: "destructive",
      });
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateCredentials = (): Credentials => {
    const username = `producer_${Math.random().toString(36).substring(2, 8)}`;
    const password = Math.random().toString(36).substring(2, 12);
    return { username, password };
  };

  const handleApprove = async () => {
    if (!applicant) return;
    
    setApproving(true);
    
    try {
      // Update application status in Firebase
      await applicationService.updateApplicationStatus(
        applicant.id, 
        'APPROVED', 
        'Admin User', // In real app, this would be the actual admin user
        'Application approved and credentials generated'
      );
      
      // Generate credentials
      const newCredentials = generateCredentials();
      setCredentials(newCredentials);
      
      // Update local state
      setApplicant({ ...applicant, status: 'APPROVED' });
      setShowConfirmDialog(false);
      
      toast({
        title: "Producer approved successfully",
        description: "Credentials have been generated and stored.",
      });
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error approving application",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!applicant || !rejectReason.trim()) return;
    
    setRejecting(true);
    
    try {
      // Update application status in Firebase
      await applicationService.updateApplicationStatus(
        applicant.id, 
        'REJECTED', 
        'Admin User', // In real app, this would be the actual admin user
        rejectReason.trim()
      );
      
      // Update local state
      setApplicant({ ...applicant, status: 'REJECTED' });
      setShowRejectDialog(false);
      setRejectReason('');
      
      toast({
        title: "Application rejected",
        description: "The application has been rejected with the provided reason.",
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error rejecting application",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRejecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openDocument = (fileType: 'aadhaar' | 'landRecord') => {
    if (!applicant) return;
    
    const fileUrl = fileType === 'aadhaar' ? applicant.aadhaarFileUrl : applicant.landRecordFileUrl;
    
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      toast({
        title: "Document not available",
        description: `${fileType === 'aadhaar' ? 'Aadhaar card' : 'Land record document'} is not available.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Applicant Review</h1>
              <p className="text-muted-foreground">Review and approve producer application</p>
            </div>
          </div>
          
          <Badge 
            variant={applicant.status === 'APPROVED' ? 'default' : 'secondary'}
            className={`text-base px-4 py-2 ${
              applicant.status === 'APPROVED' 
                ? 'bg-success text-success-foreground' 
                : applicant.status === 'REJECTED'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-warning/20 text-warning'
            }`}
          >
            {applicant.status}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-semibold text-foreground">{applicant.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-lg text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {applicant.email}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cooperative Name</label>
                  <p className="text-lg text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {applicant.cooperativeName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                  <p className="text-lg text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(applicant.submissionDate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Aadhaar Card</h3>
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {applicant.aadhaarFileName || 'aadhaar_document.pdf'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDocument('aadhaar')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Aadhaar
                    </Button>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Land Record</h3>
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {applicant.landRecordFileName || 'land_record_document.pdf'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDocument('landRecord')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Land Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div>
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicant.status === 'PENDING' ? (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowConfirmDialog(true)}
                      className="w-full gradient-primary text-primary-foreground"
                      size="lg"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve and Generate Credentials
                    </Button>
                    <Button 
                      onClick={() => setShowRejectDialog(true)}
                      variant="destructive"
                      className="w-full"
                      size="lg"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                ) : applicant.status === 'APPROVED' ? (
                  <div className="text-center p-4 bg-success-light rounded-lg">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="font-semibold text-foreground">Already Approved</p>
                    <p className="text-sm text-muted-foreground">
                      This producer has been approved and credentials have been generated.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <X className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="font-semibold text-foreground">Application Rejected</p>
                    <p className="text-sm text-muted-foreground">
                      This application has been rejected.
                    </p>
                    {applicant.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Reason: {applicant.notes}
                      </p>
                    )}
                  </div>
                )}

                {credentials && (
                  <Card className="bg-success-light border-success/30">
                    <CardHeader>
                      <CardTitle className="text-success flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Generated Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Username</label>
                        <p className="font-mono text-sm bg-background p-2 rounded border">
                          {credentials.username}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Password</label>
                        <p className="font-mono text-sm bg-background p-2 rounded border">
                          {credentials.password}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Credentials have been stored and would normally be sent via email.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Producer Application?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to approve <strong>{applicant.fullName}</strong> as a producer? 
              This will generate login credentials and grant them access to the system.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={approving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={approving}
              className="gradient-primary text-primary-foreground"
            >
              {approving ? "Approving..." : "Yes, Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Producer Application?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to reject <strong>{applicant.fullName}</strong>'s application? 
              Please provide a reason for rejection.
            </p>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full mt-2 p-3 border border-border rounded-lg resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
              }}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={rejecting || !rejectReason.trim()}
              variant="destructive"
            >
              {rejecting ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantDetail;