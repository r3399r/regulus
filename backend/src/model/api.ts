import { Category } from './entity/CategoryEntity';
import { Chapter } from './entity/ChapterEntity';
import { Question } from './entity/QuestionEntity';
import { Result } from './entity/ResultEntity';
import { User } from './entity/UserEntity';
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

export type PostResultRequest = {
  questionId: string;
  userId: string;
  score: number;
};

export type GetUserResponse = User[];

export type GetUserIdResponse = User & {
  categoryScore: { name: string; score: number }[];
  chapterScore: { name: string; score: number }[];
  results: Result[];
};
