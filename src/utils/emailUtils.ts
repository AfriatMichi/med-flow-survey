import { format } from "date-fns";

interface EmailData {
  personalData: {
    fullName: string;
    date: Date | undefined;
  };
  medicalQuestions: string[];
  questionnaireData: Record<number, boolean>;
}

export const sendQuestionnaireEmail = ({ personalData, medicalQuestions, questionnaireData }: EmailData) => {
  // Create detailed questionnaire results
  let questionsAndAnswers = '';
  medicalQuestions.forEach((question, index) => {
    const answer = questionnaireData[index] ? 'Yes' : 'No';
    questionsAndAnswers += `${index + 1}. ${question}\nAnswer: ${answer}\n\n`;
  });

  const subject = encodeURIComponent("Medical Questionnaire Results");
  const body = encodeURIComponent(`
Medical Questionnaire Results

Patient Information:
- Name: ${personalData.fullName}
- Date: ${personalData.date ? format(personalData.date, "PPP") : ""}

Questionnaire Summary:
- Total Questions: ${medicalQuestions.length}
- Status: Completed
- Completion Date: ${new Date().toLocaleDateString()}

Questions and Answers:
${questionsAndAnswers}

This questionnaire has been completed and digitally signed.
  `);

  // Create mailto link
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  
  // Try to open email client
  window.location.href = mailtoLink;
};