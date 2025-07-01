// Utility functions for managing medical questions

export interface Question {
  id: number;
  text: string;
  order: number;
}

const DEFAULT_QUESTIONS = [
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

export const getQuestions = (): string[] => {
  try {
    const savedQuestions = localStorage.getItem('medicalQuestions');
    if (savedQuestions) {
      const questions: Question[] = JSON.parse(savedQuestions);
      return questions
        .sort((a, b) => a.order - b.order)
        .map(q => q.text);
    }
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
  }
  
  return DEFAULT_QUESTIONS;
};

export const initializeQuestions = (): void => {
  const existing = localStorage.getItem('medicalQuestions');
  if (!existing) {
    const defaultQuestions: Question[] = DEFAULT_QUESTIONS.map((text, index) => ({
      id: index + 1,
      text,
      order: index + 1
    }));
    localStorage.setItem('medicalQuestions', JSON.stringify(defaultQuestions));
  }
};