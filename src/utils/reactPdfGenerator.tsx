import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { getQuestions } from './questionManager';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2563eb',
    borderBottom: '2pt solid #2563eb',
    paddingBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  questionContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    border: '1pt solid #e2e8f0',
    borderRadius: 3,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.4,
    textAlign: 'left', // Will be changed to 'right' for Hebrew
  },
  answer: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  answerNo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  signature: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  signatureNote: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 10,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1pt solid #e2e8f0',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  // Hebrew-specific styles
  rtlText: {
    textAlign: 'right',
    direction: 'rtl',
  },
});

interface PDFDocumentProps {
  fullName: string;
  date?: Date;
  answers: Record<number, boolean>;
  signature: string;
}

const QuestionnairePDFDocument: React.FC<PDFDocumentProps> = ({
  fullName,
  date,
  answers,
  signature
}) => {
  const questions = getQuestions();
  
  // Detect if text contains Hebrew characters
  const isHebrew = (text: string) => {
    return /[\u0590-\u05FF]/.test(text);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Medical Questionnaire Results</Text>
        
        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={[styles.value, isHebrew(fullName) && styles.rtlText]}>{fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{date ? format(date, "PPP") : "Not specified"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Generated:</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Questions and Answers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questionnaire Responses ({questions.length} questions)</Text>
          
          {questions.map((question, index) => {
            const answer = answers[index];
            const questionIsHebrew = isHebrew(question);
            
            return (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <Text style={[
                  styles.questionText,
                  questionIsHebrew && styles.rtlText
                ]}>
                  {question}
                </Text>
                <Text style={answer ? styles.answer : styles.answerNo}>
                  Answer: {answer ? 'Yes' : 'No'}
                  {questionIsHebrew && (answer ? ' כן' : ' לא')}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Signature Section */}
        <View style={styles.signature}>
          <Text style={styles.signatureTitle}>Digital Signature</Text>
          <Text style={styles.signatureNote}>
            This questionnaire has been completed and digitally signed by the patient.
          </Text>
          <Text style={styles.signatureNote}>
            Signature captured on: {new Date().toLocaleString()}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Medical Questionnaire - Generated automatically - Page 1 of 1
        </Text>
      </Page>
    </Document>
  );
};

export const generateQuestionnairePDF = async (data: {
  fullName: string;
  date?: Date;
  signature: string;
  answers: Record<number, boolean>;
}) => {
  const blob = await pdf(
    <QuestionnairePDFDocument
      fullName={data.fullName}
      date={data.date}
      answers={data.answers}
      signature={data.signature}
    />
  ).toBlob();
  
  return blob;
};

// Legacy function for compatibility
export const generatePDF = generateQuestionnairePDF;