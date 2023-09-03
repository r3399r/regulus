export type PostQuestionRequest = {
  content: string;
  answer: string;
  answerFormat: string;
  category: string[];
  chapter: string[];
  // "tag": string[],
  youtube: string | null;
}[];
