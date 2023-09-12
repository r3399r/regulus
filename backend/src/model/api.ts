import { Category } from './entity/CategoryEntity';
import { Chapter } from './entity/ChapterEntity';
import { Question } from './entity/QuestionEntity';
import { Tag } from './entity/TagEntity';
import { PaginationParams } from './Pagination';

export type PostQuestionRequest = {
  content: string;
  answer: string;
  answerFormat: string;
  category?: string[];
  chapter?: string[];
  tag?: string[];
  youtube?: string;
  hasSolution: boolean;
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
  hasSolution?: boolean;
};

export type PutQuestionResponse = Question;

export type GetQuestionParams = PaginationParams & {
  id?: string;
  categoryId?: string;
  chapterId?: string;
  tagId?: string;
};

export type GetQuestionResponse = Question[];

export type GetFieldResponse = {
  category: Category[];
  chapter: Chapter[];
  tag: Tag[];
};
