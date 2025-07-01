import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "admin123"; // Simple password protection

interface Question {
  id: number;
  text: string;
  order: number;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    // Load questions from localStorage or use defaults
    const savedQuestions = localStorage.getItem('medicalQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Default questions
      const defaultQuestions = [
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
      ].map((text, index) => ({
        id: index + 1,
        text,
        order: index + 1
      }));
      setQuestions(defaultQuestions);
      localStorage.setItem('medicalQuestions', JSON.stringify(defaultQuestions));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const saveQuestions = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
    localStorage.setItem('medicalQuestions', JSON.stringify(updatedQuestions));
    toast({
      title: "Questions Updated",
      description: "Changes have been saved successfully",
    });
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const newQ: Question = {
      id: Date.now(),
      text: newQuestion.trim(),
      order: questions.length + 1
    };
    
    const updatedQuestions = [...questions, newQ];
    saveQuestions(updatedQuestions);
    setNewQuestion('');
  };

  const deleteQuestion = (id: number) => {
    const updatedQuestions = questions
      .filter(q => q.id !== id)
      .map((q, index) => ({ ...q, order: index + 1 }));
    saveQuestions(updatedQuestions);
  };

  const moveQuestion = (id: number, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newQuestions[currentIndex], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[currentIndex]];
    
    // Update order numbers
    const updatedQuestions = newQuestions.map((q, index) => ({ ...q, order: index + 1 }));
    saveQuestions(updatedQuestions);
  };

  const updateQuestion = (id: number, newText: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, text: newText } : q
    );
    saveQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center bg-gray-800 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 mr-2" />
              <CardTitle className="text-2xl">Admin Access</CardTitle>
            </div>
            <p className="text-gray-300">Enter password to continue</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gray-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                <CardTitle className="text-xl">Question Management</CardTitle>
              </div>
              <Button 
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-800"
              >
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600">Manage medical questionnaire questions and their order</p>
          </CardContent>
        </Card>

        {/* Add New Question */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Textarea
                placeholder="Enter new question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addQuestion} disabled={!newQuestion.trim()}>
                Add Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Current Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.order}</TableCell>
                    <TableCell>
                      {editingQuestion?.id === question.id ? (
                        <div className="flex gap-2">
                          <Textarea
                            defaultValue={question.text}
                            onBlur={(e) => updateQuestion(question.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                updateQuestion(question.id, e.currentTarget.value);
                              }
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button 
                            size="sm"
                            onClick={() => setEditingQuestion(null)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span 
                          onClick={() => setEditingQuestion(question)}
                          className="cursor-pointer hover:bg-gray-50 p-2 rounded block"
                        >
                          {question.text}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveQuestion(question.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveQuestion(question.id, 'down')}
                          disabled={index === questions.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;