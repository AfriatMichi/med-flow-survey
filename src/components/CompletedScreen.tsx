import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail } from "lucide-react";
import { format } from "date-fns";

interface CompletedScreenProps {
  personalData: {
    fullName: string;
    date: Date | undefined;
  };
  questionCount: number;
  onGeneratePDF: () => void;
  onSendEmail: () => void;
  onStartNew: () => void;
}

const CompletedScreen: React.FC<CompletedScreenProps> = ({
  personalData,
  questionCount,
  onGeneratePDF,
  onSendEmail,
  onStartNew
}) => {
  return (
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
              <p>All {questionCount} questions completed and signature captured</p>
              <p className="text-sm text-gray-600 mt-2">
                Your responses have been recorded for medical review
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onGeneratePDF}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              
              <Button 
                onClick={onSendEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
            
            <Button 
              onClick={onStartNew}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start New Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedScreen;