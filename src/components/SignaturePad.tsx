
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenTool, RotateCcw, Check } from "lucide-react";

interface SignaturePadProps {
  patientName: string;
  questionCount: number;
  answeredCount: number;
  onSignatureComplete: (signature: string) => void;
  onBack: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  patientName,
  questionCount,
  answeredCount,
  onSignatureComplete,
  onBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set drawing styles
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const signatureData = canvas.toDataURL();
    onSignatureComplete(signatureData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-blue-200">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center">
              <PenTool className="h-6 w-6 mr-2" />
              <div>
                <CardTitle className="text-xl">Digital Signature</CardTitle>
                <p className="text-blue-100 text-sm">Patient: {patientName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Questionnaire Summary</h3>
              <p className="text-green-700">
                ✓ Completed {answeredCount} of {questionCount} questions
              </p>
              <p className="text-sm text-green-600 mt-1">
                Please provide your digital signature to complete the process
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Signature Pad */}
        <Card className="shadow-lg border-blue-200 mb-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <PenTool className="h-5 w-5 mr-2" />
              Please sign below
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-48 cursor-crosshair border border-gray-200 rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                {isEmpty ? 'Click and drag to create your signature' : 'Signature captured'}
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button
                onClick={clearSignature}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Signature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-lg border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Questions
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isEmpty ? 'Signature required to complete' : 'Ready to submit'}
                </p>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={isEmpty}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Questionnaire
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignaturePad;
