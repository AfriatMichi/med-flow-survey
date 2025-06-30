import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User, FileText, CheckCircle, Download, Mail } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MedicalQuestionnaire from "../components/MedicalQuestionnaire";
import { toast } from "@/hooks/use-toast";
import { generateQuestionnairePDF } from "../utils/pdfGenerator";

const Index = () => {
  const [currentStep, setCurrentStep] = useState('personal'); // 'personal', 'questionnaire', 'completed'
  const [personalData, setPersonalData] = useState({
    fullName: '',
    date: undefined as Date | undefined
  });
  const [questionnaireData, setQuestionnaireData] = useState({});
  const [signature, setSignature] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }
    
    if (!personalData.date) {
      toast({
        title: "Error", 
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: any, signatureData: string) => {
    setQuestionnaireData(answers);
    setSignature(signatureData);
    setCurrentStep('completed');
    toast({
      title: "Success",
      description: "Medical questionnaire completed successfully!",
    });
  };

  const generatePDF = () => {
    try {
      const pdf = generateQuestionnairePDF({
        fullName: personalData.fullName,
        date: personalData.date,
        signature: signature,
        answers: questionnaireData as Record<number, boolean>
      });
      
      pdf.save(`medical-questionnaire-${personalData.fullName.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your questionnaire has been saved as a PDF file",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Medical Questionnaire Results");
    const body = encodeURIComponent(`
Medical Questionnaire Results

Patient Information:
- Name: ${personalData.fullName}
- Date: ${personalData.date ? format(personalData.date, "PPP") : ""}

Questionnaire Summary:
- Total Questions: 20
- Status: Completed
- Completion Date: ${new Date().toLocaleDateString()}

This questionnaire has been completed and digitally signed.
    `);

    // Create mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Try to open email client
    window.location.href = mailtoLink;

    toast({
      title: "Email Client Opened",
      description: "Your default email client should open with the questionnaire data",
    });
  };

  const renderPersonalForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-2">
            <User className="h-8 w-8 mr-2" />
            <CardTitle className="text-2xl">Medical Questionnaire</CardTitle>
          </div>
          <p className="text-blue-100">Please provide your personal details to begin</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handlePersonalSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={personalData.fullName}
                onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Date *</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-200 focus:border-blue-500",
                      !personalData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {personalData.date ? format(personalData.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={personalData.date}
                    onSelect={(date) => {
                      setPersonalData({...personalData, date});
                      setDatePickerOpen(false);
                    }}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            >
              Start Questionnaire
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompletedScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-green-200">
        <CardHeader className="text-center bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 mr-2" />
            <CardTitle className="text-2xl">Questionnaire Completed</CardTitle>
          </div>
          <p className="text-green-100">Thank you for completing the medical questionnaire</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
              <p><strong>Name:</strong> {personalData.fullName}</p>
              <p><strong>Date:</strong> {personalData.date && format(personalData.date, "PPP")}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Questionnaire Summary</h3>
              <p>All 20 questions completed and signature captured</p>
              <p className="text-sm text-gray-600 mt-2">
                Your responses have been recorded for medical review
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={generatePDF}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              
              <Button 
                onClick={sendEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
            
            <Button 
              onClick={() => {
                setCurrentStep('personal');
                setPersonalData({fullName: '', date: undefined});
                setQuestionnaireData({});
                setSignature('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start New Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (currentStep === 'personal') {
    return renderPersonalForm();
  }
  
  if (currentStep === 'questionnaire') {
    return (
      <MedicalQuestionnaire 
        patientName={personalData.fullName}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }
  
  return renderCompletedScreen();
};

export default Index;
