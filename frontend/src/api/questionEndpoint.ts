import {
  GetQuestionParams,
  GetQuestionResponse,
  PostQuestionRequest,
  PostQuestionResponse,
  PutQuestionRequest,
  PutQuestionResponse,
} from 'src/model/backend/api';
import http from 'src/util/http';

const getQuestion = async (params?: GetQuestionParams) =>
  await http.get<GetQuestionResponse, GetQuestionParams>('question', { params });

const postQuestion = async (data: PostQuestionRequest) =>
  await http.post<PostQuestionResponse, PostQuestionRequest>('question', { data });

const putQuestion = async (id: string, data: PutQuestionRequest) =>
  await http.put<PutQuestionResponse, PutQuestionRequest>(`question/${id}`, { data });

export default {
  getQuestion,
  postQuestion,
  putQuestion,
};
