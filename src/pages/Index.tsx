import React, { useState, useEffect } from 'react';
import MedicalQuestionnaire from "../components/MedicalQuestionnaire";
import PersonalForm from "../components/PersonalForm";
import CompletedScreen from "../components/CompletedScreen";
import { toast } from "@/hooks/use-toast";
import { generateQuestionnairePDF } from "../utils/pdfGenerator";
import { getQuestions, initializeQuestions } from "../utils/questionManager";
import { sendQuestionnaireEmail } from "../utils/emailUtils";

const Index = () => {
  const [currentStep, setCurrentStep] = useState('personal'); // 'personal', 'questionnaire', 'completed'
  const [personalData, setPersonalData] = useState({
    fullName: '',
    date: undefined as Date | undefined
  });
  const [questionnaireData, setQuestionnaireData] = useState({});
  const [signature, setSignature] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [medicalQuestions, setMedicalQuestions] = useState<string[]>([]);

  useEffect(() => {
    initializeQuestions();
    setMedicalQuestions(getQuestions());
  }, []);

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
    sendQuestionnaireEmail({
      personalData,
      medicalQuestions,
      questionnaireData: questionnaireData as Record<number, boolean>
    });

    toast({
      title: "Email Client Opened",
      description: "Your default email client should open with the questionnaire data",
    });
  };

  const handleStartNew = () => {
    setCurrentStep('personal');
    setPersonalData({fullName: '', date: undefined});
    setQuestionnaireData({});
    setSignature('');
  };

  if (currentStep === 'personal') {
    return (
      <PersonalForm
        personalData={personalData}
        onPersonalDataChange={setPersonalData}
        onSubmit={handlePersonalSubmit}
        datePickerOpen={datePickerOpen}
        onDatePickerOpenChange={setDatePickerOpen}
      />
    );
  }
  
  if (currentStep === 'questionnaire') {
    return (
      <MedicalQuestionnaire 
        patientName={personalData.fullName}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }
  
  return (
    <CompletedScreen
      personalData={personalData}
      questionCount={medicalQuestions.length}
      onGeneratePDF={generatePDF}
      onSendEmail={sendEmail}
      onStartNew={handleStartNew}
    />
  );
};

export default Index;
