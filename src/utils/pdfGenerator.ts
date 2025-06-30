
import jsPDF from 'jspdf';

interface QuestionnaireData {
  fullName: string;
  date: Date | undefined;
  signature: string;
  answers: Record<number, boolean>;
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

// Function to detect if text contains Hebrew characters
const containsHebrew = (text: string): boolean => {
  return /[\u0590-\u05FF]/.test(text);
};

// Function to reverse Hebrew text for proper display
const reverseHebrewText = (text: string): string => {
  if (!containsHebrew(text)) return text;
  
  // Split by spaces and reverse the order of Hebrew words
  const words = text.split(' ');
  const reversedWords = words.reverse();
  return reversedWords.join(' ');
};

// Function to handle text direction for Hebrew
const processText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth?: number) => {
  // For Hebrew text, we need special handling
  if (containsHebrew(text)) {
    const processedText = reverseHebrewText(text);
    
    if (maxWidth) {
      // For Hebrew, we need to handle line breaks differently
      const words = processedText.split(' ');
      let currentLine = '';
      let lineCount = 0;
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const lineWidth = pdf.getTextWidth(testLine);
        
        if (lineWidth > maxWidth && currentLine) {
          pdf.text(currentLine, x, y + (lineCount * 5), { align: 'right' });
          currentLine = word;
          lineCount++;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        pdf.text(currentLine, x, y + (lineCount * 5), { align: 'right' });
        lineCount++;
      }
      
      return lineCount * 5;
    } else {
      pdf.text(processedText, x, y, { align: 'right' });
      return 5;
    }
  } else {
    // For English text, use normal LTR direction
    if (maxWidth) {
      const splitText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(splitText, x, y);
      return Array.isArray(splitText) ? splitText.length * 5 : 5;
    } else {
      pdf.text(text, x, y);
      return 5;
    }
  }
};

export const generateQuestionnairePDF = (data: QuestionnaireData) => {
  const pdf = new jsPDF();
  
  // Set font to support Hebrew characters better
  pdf.setFont('helvetica');
  
  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('Medical Questionnaire Report', 20, 30);
  
  // Patient Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Patient Information', 20, 50);
  
  pdf.setFontSize(12);
  pdf.text(`Name: ${data.fullName}`, 20, 65);
  pdf.text(`Date: ${data.date ? data.date.toLocaleDateString() : 'Not specified'}`, 20, 75);
  
  // Questionnaire Summary
  pdf.setFontSize(16);
  pdf.text('Questionnaire Summary', 20, 95);
  
  pdf.setFontSize(12);
  pdf.text('Total Questions: 20', 20, 110);
  pdf.text('Status: Completed', 20, 120);
  pdf.text(`Completion Date: ${new Date().toLocaleDateString()}`, 20, 130);
  
  // Questions and Answers
  pdf.setFontSize(16);
  pdf.text('Questions and Answers', 20, 150);
  
  let yPosition = 165;
  pdf.setFontSize(10);
  
  medicalQuestions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 260) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const answer = data.answers[index] ? 'Yes' : 'No';
    const questionText = `${index + 1}. ${question}`;
    const answerText = `Answer: ${answer}`;
    
    // Process question text with Hebrew support
    const questionHeight = processText(pdf, questionText, 20, yPosition, 170);
    yPosition += questionHeight;
    
    pdf.setTextColor(37, 99, 235);
    processText(pdf, answerText, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 10;
  });
  
  // Add signature if available (on a new page if needed)
  if (data.signature) {
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.text('Digital Signature', 20, yPosition);
    
    try {
      // Add signature image
      pdf.addImage(data.signature, 'PNG', 20, yPosition + 10, 100, 40);
    } catch (error) {
      console.warn('Could not add signature to PDF:', error);
      pdf.setFontSize(12);
      pdf.text('Signature captured (unable to display in PDF)', 20, yPosition + 20);
    }
  }
  
  // Footer on last page
  const pageCount = pdf.getNumberOfPages();
  pdf.setPage(pageCount);
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generated by Medical Questionnaire System', 20, 280);
  
  return pdf;
};
