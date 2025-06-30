
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import SignaturePad from "./SignaturePad";

interface MedicalQuestionnaireProps {
  patientName: string;
  onComplete: (answers: Record<number, boolean>, signature: string) => void;
}

const medicalQuestions = [
  "Do you have any allergies to medications?",
  "Are you currently taking any prescription medications?",
  "Do you have a history of heart disease?",
  "Have you ever had high blood pressure?",
  "Do you have diabetes or a family history of diabetes?",
  "Have you ever been diagnosed with cancer?",
  "Do you smoke or have you smoked in the past?",
  "Do you consume alcohol regularly?",
  "Have you had any surgeries in the past 5 years?",
  "Do you have any chronic pain conditions?",
  "Are you currently experiencing any symptoms?",
  "Do you have a history of mental health conditions?",
  "Have you ever had kidney or liver problems?",
  "Do you have any breathing difficulties or asthma?",
  "Are you pregnant or planning to become pregnant?",
  "Do you have any vision or hearing problems?",
  "Have you ever had blood clots or circulation issues?",
  "Do you have any skin conditions or rashes?",
  "Are you up to date with your vaccinations?",
  "Do you exercise regularly or maintain an active lifestyle?"
];

const MedicalQuestionnaire: React.FC<MedicalQuestionnaireProps> = ({ 
  patientName, 
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showSignature, setShowSignature] = useState(false);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < medicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < medicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSignature(true);
    }
  };

  const handleFinish = () => {
    if (currentQuestion === medicalQuestions.length - 1) {
      setShowSignature(true);
    }
  };

  const handleSignatureComplete = (signatureData: string) => {
    onComplete(answers, signatureData);
  };

  const progress = ((currentQuestion + 1) / medicalQuestions.length) * 100;
  const isLastQuestion = currentQuestion === medicalQuestions.length - 1;
  const hasAnswered = answers.hasOwnProperty(currentQuestion);

  if (showSignature) {
    return (
      <SignaturePad 
        patientName={patientName}
        questionCount={medicalQuestions.length}
        answeredCount={Object.keys(answers).length}
        onSignatureComplete={handleSignatureComplete}
        onBack={() => setShowSignature(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-blue-200">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                <div>
                  <CardTitle className="text-xl">Medical Questionnaire</CardTitle>
                  <p className="text-blue-100 text-sm">Patient: {patientName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Progress</p>
                <p className="font-semibold">{currentQuestion + 1} of {medicalQuestions.length}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Progress value={progress} className="w-full h-3" />
            <p className="text-center text-sm text-gray-600 mt-2">
              {Math.round(progress)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-lg border-blue-200 mb-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg text-gray-800">
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
                {medicalQuestions[currentQuestion]}
              </h2>
              
              <div className="flex justify-center space-x-6">
                <Button
                  onClick={() => handleAnswer(true)}
                  size="lg"
                  className={`px-12 py-4 text-lg font-medium ${
                    answers[currentQuestion] === true 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  size="lg"
                  className={`px-12 py-4 text-lg font-medium ${
                    answers[currentQuestion] === false 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
                  No
                </Button>
              </div>
              
              {hasAnswered && (
                <p className="mt-4 text-sm text-gray-600">
                  You answered: {answers[currentQuestion] ? 'Yes' : 'No'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="shadow-lg border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                size="lg"
                className="border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {Object.keys(answers).length} of {medicalQuestions.length} questions answered
                </p>
              </div>
              
              {isLastQuestion ? (
                <Button
                  onClick={handleFinish}
                  disabled={!hasAnswered}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Finish
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalQuestionnaire;
