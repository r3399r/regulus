import {
  GetQuestionResponse,
  PostQuestionRequest,
  PostQuestionResponse,
} from 'src/model/backend/api';
import http from 'src/util/http';

const getQuestion = async () => await http.get<GetQuestionResponse>('question');

const postQuestion = async (data: PostQuestionRequest) =>
  await http.post<PostQuestionResponse, PostQuestionRequest>('question', { data });

export default {
  getQuestion,
  postQuestion,
};
