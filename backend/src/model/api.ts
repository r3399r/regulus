import { Question } from './entity/QuestionEntity';
import { Pagination, PaginationParams } from './Pagination';

export type PostQuestionRequest = {
  content: string;
  answer: string;
  answerFormat: string;
  category?: string[];
  chapter?: string[];
  tag?: string[];
  youtube?: string;
};

export type PostQuestionResponse = Question;

export type PutQuestionRequest = {
  content?: string;
  answer?: string;
  answerFormat?: string;
  category?: string[];
  chapter?: string[];
  tag?: string[];
  youtube?: string;
};

export type PutQuestionResponse = Question;

export type GetQuestionParams = PaginationParams & {
  id?: string;
  categoryId?: string;
  chapterId?: string;
  tagId?: string;
};

export type GetQuestionResponse = Pagination<Question[]>;
