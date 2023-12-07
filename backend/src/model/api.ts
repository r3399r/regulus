import { Category } from './entity/CategoryEntity';
import { Chapter } from './entity/ChapterEntity';
import { Question } from './entity/QuestionEntity';
import { Result } from './entity/ResultEntity';
import { Tag } from './entity/TagEntity';
import { User } from './entity/UserEntity';
import { PaginationParams } from './Pagination';

export type PostQuestionRequest = {
  content: string;
  answer: string;
  category?: string[];
  chapter?: string[];
  tag?: string[];
  youtube?: string;
  hasSolution: boolean;
  hasImage?: boolean;
  image?: string[];
  defaultScore?: number;
  defaultCount?: number;
};

export type PostQuestionResponse = Question;

export type PutQuestionRequest = {
  content?: string;
  answer?: string;
  category?: string[];
  chapter?: string[];
  tag?: string[];
  youtube?: string;
  hasSolution?: boolean;
  hasImage?: boolean;
  image?: string[];
};

export type PutQuestionResponse = Question;

export type GetQuestionParams = PaginationParams & {
  id?: string;
  category?: string;
  chapter?: string;
  tag?: string;
  q?: string;
};

export type GetQuestionResponse = (Question & {
  imageUrl: string[] | null;
  average: number | null;
})[];

export type GetFieldResponse = {
  category: Category[];
  chapter: Chapter[];
};

export type GetTagParams = {
  query?: string;
};

export type GetTagResponse = Tag[];

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
  date?: string;
};

export type GetUserResponse = User[];

export type GetUserIdResponse = {
  user: User;
  timeseries: {
    date: string;
    category: { name: string; score: number }[];
    chapter: { name: string; score: number }[];
  }[];
  results: Result[];
};

export type PostUserIdResultRequest = {
  date?: string;
  result: {
    questionId: string;
    score: number;
    date?: string;
  }[];
};
