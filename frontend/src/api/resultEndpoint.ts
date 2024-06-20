import { PostResultRequest } from 'src/model/backend/api';
import http from 'src/util/http';

const postResult = async (data: PostResultRequest) => await http.post('result', { data });

export default {
  postResult,
};
