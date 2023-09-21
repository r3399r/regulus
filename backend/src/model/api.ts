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
  image?: string[];
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
  image?: string[];
};

export type PutQuestionResponse = Question;

export type GetQuestionParams = PaginationParams & {
  id?: string;
  category?: string;
  chapter?: string;
  tag?: string;
};

export type GetQuestionResponse = (Question & {
  imageUrl: string[] | null;
})[];

export type GetFieldResponse = {
  category: Category[];
  chapter: Chapter[];
  tag: Tag[];
};

export type PostUserRequest = {
  name: string;
  email: string;
  birthday: string;
  memo: string;
};

export type PutUserRequest = {
  name?: string;
  email?: string;
  birthday?: string;
  memo?: string;
};
