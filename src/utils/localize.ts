import { Language } from '../i18n/translations';
import { BodyMotionQuestion, Question } from '../types/math';

export interface LocalizedQuestionView {
  topicName: string;
  questionText: string;
  options: string[];
  explanation: string;
  hint?: string;
}

export function getLocalizedQuestion(
  q: Question,
  language: Language
): LocalizedQuestionView {
  if (language === 'en') {
    return {
      topicName: q.topicNameEn || q.topicName,
      questionText: q.questionTextEn || q.questionText,
      options: q.optionsEn && q.optionsEn.length === q.options.length ? q.optionsEn : q.options,
      explanation: q.explanationEn || q.explanation,
      hint: q.hintEn || q.hint,
    };
  }
  return {
    topicName: q.topicName,
    questionText: q.questionText,
    options: q.options,
    explanation: q.explanation,
    hint: q.hint,
  };
}

export function getLocalizedBodyMotionQuestion(
  q: BodyMotionQuestion,
  language: Language
) {
  const isEn = language === 'en';
  return {
    ...q,
    topicName: isEn ? q.topicNameEn || q.topicName : q.topicName,
    questionText: isEn ? q.questionTextEn || q.questionText : q.questionText,
    explanation: isEn ? q.explanationEn || q.explanation : q.explanation,
    hint: isEn ? q.hintEn || q.hint : q.hint,
    options: q.options.map((opt) => ({
      ...opt,
      text: isEn ? opt.textEn || opt.text : opt.text,
      poseLabel: isEn ? opt.poseLabelEn || opt.poseLabel : opt.poseLabel,
    })),
  };
}
