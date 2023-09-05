import { GetQuestionResponse } from 'src/model/backend/api';
import http from 'src/util/http';

const getQuestion = async () => await http.get<GetQuestionResponse>('question');

export default {
  getQuestion,
};
