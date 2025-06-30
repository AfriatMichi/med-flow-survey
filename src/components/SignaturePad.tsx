
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, RotateCcw, Check, ArrowLeft } from "lucide-react";

interface SignaturePadProps {
  patientName: string;
  questionCount: number;
  answeredCount: number;
  onSignatureComplete: (signatureData: string) => void;
  onBack: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  patientName,
  onSignatureComplete,
  onBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getEventPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const completeSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const signatureData = canvas.toDataURL();
      onSignatureComplete(signatureData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-xl flex items-center">
              <PenTool className="h-6 w-6 mr-2" />
              Digital Signature
            </CardTitle>
            <p className="text-green-100">
              Hello {patientName}, please sign below to complete your questionnaire
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="w-full h-48 bg-white border rounded cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Sign using your mouse or finger
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="flex gap-3">
                <Button
                  onClick={clearSignature}
                  variant="outline"
                  size="lg"
                  className="border-gray-300"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>

                <Button
                  onClick={completeSignature}
                  disabled={!hasSignature}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignaturePad;
