export type QuestionForm = {
  content: string;
  answer: string;
  category: string;
  chapter: string;
  tag: string;
  youtube: string;
  hasSolution: boolean;
  defaultScore: string;
  defaultCount: string;
};

export type ResultForm = {
  questionId: string;
  userId: string;
  score: string;
}[];
