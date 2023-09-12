import { GetFieldResponse } from 'src/model/backend/api';
import http from 'src/util/http';

const getField = async () => await http.get<GetFieldResponse>('field');

export default {
  getField,
};
