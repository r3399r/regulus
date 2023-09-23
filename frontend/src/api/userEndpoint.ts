import { GetUserIdResponse, GetUserResponse } from 'src/model/backend/api';
import http from 'src/util/http';

const getUser = async () => await http.get<GetUserResponse>('user');

const getUserId = async (id: string) => await http.get<GetUserIdResponse>(`user/${id}`);

export default {
  getUser,
  getUserId,
};
