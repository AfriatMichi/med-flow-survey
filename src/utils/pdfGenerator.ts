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

// Function to properly handle Hebrew text for PDF
const processHebrewText = (text: string): string => {
  if (!containsHebrew(text)) return text;
  
  // Split text into words and handle mixed content
  const words = text.split(' ');
  const processedWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (containsHebrew(word)) {
      // Reverse Hebrew characters within the word
      processedWords.push(word.split('').reverse().join(''));
    } else {
      processedWords.push(word);
    }
  }
  
  // For RTL languages, reverse the word order
  return processedWords.reverse().join(' ');
};

// Function to handle text rendering with proper Hebrew support
const renderText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth?: number, align: 'left' | 'right' | 'center' = 'left') => {
  const isHebrew = containsHebrew(text);
  
  if (isHebrew) {
    // Process Hebrew text
    const processedText = processHebrewText(text);
    
    if (maxWidth) {
      // Manual line breaking for Hebrew text
      const words = processedText.split(' ');
      let currentLine = '';
      let lines: string[] = [];
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const lineWidth = pdf.getTextWidth(testLine);
        
        if (lineWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Render lines
      lines.forEach((line, index) => {
        pdf.text(line, x, y + (index * 6), { align: 'right' });
      });
      
      return lines.length * 6;
    } else {
      pdf.text(processedText, x, y, { align: 'right' });
      return 6;
    }
  } else {
    // Handle English text normally
    if (maxWidth) {
      const splitText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(splitText, x, y, { align });
      return Array.isArray(splitText) ? splitText.length * 6 : 6;
    } else {
      pdf.text(text, x, y, { align });
      return 6;
    }
  }
};

// Function to add Hebrew font support (if you have a Hebrew font file)
const addHebrewFontSupport = (pdf: jsPDF) => {
  // If you have a Hebrew font file, you can add it like this:
  // pdf.addFont('path/to/hebrew-font.ttf', 'HebrewFont', 'normal');
  // pdf.setFont('HebrewFont');
  
  // For now, we'll use a Unicode-compatible approach
  // Note: This is a workaround - for best results, you should add a proper Hebrew font
  try {
    // Try to set font that might have better Unicode support
    pdf.setFont('helvetica', 'normal');
  } catch (error) {
    console.warn('Could not set Hebrew font, using default');
  }
};

export const generateQuestionnairePDF = (data: QuestionnaireData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add Hebrew font support
  addHebrewFontSupport(pdf);
  
  // Set initial font size and color
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // Blue color
  
  // Title - check if it contains Hebrew
  const title = 'Medical Questionnaire Report';
  if (containsHebrew(title)) {
    renderText(pdf, title, 190, 30, undefined, 'right');
  } else {
    pdf.text(title, 20, 30);
  }
  
  // Patient Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  const patientInfoTitle = 'Patient Information';
  if (containsHebrew(patientInfoTitle)) {
    renderText(pdf, patientInfoTitle, 190, 50, undefined, 'right');
  } else {
    pdf.text(patientInfoTitle, 20, 50);
  }
  
  pdf.setFontSize(12);
  
  // Name field
  const nameLabel = `Name: ${data.fullName}`;
  if (containsHebrew(nameLabel)) {
    renderText(pdf, nameLabel, 190, 65, undefined, 'right');
  } else {
    pdf.text(nameLabel, 20, 65);
  }
  
  // Date field
  const dateLabel = `Date: ${data.date ? data.date.toLocaleDateString() : 'Not specified'}`;
  if (containsHebrew(dateLabel)) {
    renderText(pdf, dateLabel, 190, 75, undefined, 'right');
  } else {
    pdf.text(dateLabel, 20, 75);
  }
  
  // Questionnaire Summary
  pdf.setFontSize(16);
  const summaryTitle = 'Questionnaire Summary';
  if (containsHebrew(summaryTitle)) {
    renderText(pdf, summaryTitle, 190, 95, undefined, 'right');
  } else {
    pdf.text(summaryTitle, 20, 95);
  }
  
  pdf.setFontSize(12);
  pdf.text('Total Questions: 20', 20, 110);
  pdf.text('Status: Completed', 20, 120);
  pdf.text(`Completion Date: ${new Date().toLocaleDateString()}`, 20, 130);
  
  // Questions and Answers
  pdf.setFontSize(16);
  const questionsTitle = 'Questions and Answers';
  if (containsHebrew(questionsTitle)) {
    renderText(pdf, questionsTitle, 190, 150, undefined, 'right');
  } else {
    pdf.text(questionsTitle, 20, 150);
  }
  
  let yPosition = 165;
  pdf.setFontSize(10);
  
  medicalQuestions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      addHebrewFontSupport(pdf);
      yPosition = 20;
    }
    
    const answer = data.answers[index] ? 'Yes' : 'No';
    const questionText = `${index + 1}. ${question}`;
    const answerText = `Answer: ${answer}`;
    
    // Render question
    const questionHeight = renderText(pdf, questionText, containsHebrew(questionText) ? 190 : 20, yPosition, 170);
    yPosition += questionHeight;
    
    // Render answer
    pdf.setTextColor(37, 99, 235);
    const answerHeight = renderText(pdf, answerText, containsHebrew(answerText) ? 190 : 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += answerHeight + 5;
  });
  
  // Add signature if available
  if (data.signature) {
    if (yPosition > 200) {
      pdf.addPage();
      addHebrewFontSupport(pdf);
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    const signatureTitle = 'Digital Signature';
    if (containsHebrew(signatureTitle)) {
      renderText(pdf, signatureTitle, 190, yPosition, undefined, 'right');
    } else {
      pdf.text(signatureTitle, 20, yPosition);
    }
    
    try {
      // Add signature image
      pdf.addImage(data.signature, 'PNG', 20, yPosition + 10, 100, 40);
    } catch (error) {
      console.warn('Could not add signature to PDF:', error);
      pdf.setFontSize(12);
      const signatureNote = 'Signature captured (unable to display in PDF)';
      if (containsHebrew(signatureNote)) {
        renderText(pdf, signatureNote, 190, yPosition + 20, undefined, 'right');
      } else {
        pdf.text(signatureNote, 20, yPosition + 20);
      }
    }
  }
  
  // Footer on last page
  const pageCount = pdf.getNumberOfPages();
  pdf.setPage(pageCount);
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  const footerText = 'Generated by Medical Questionnaire System';
  if (containsHebrew(footerText)) {
    renderText(pdf, footerText, 190, 280, undefined, 'right');
  } else {
    pdf.text(footerText, 20, 280);
  }
  
  return pdf;
};
