import { GetFieldResponse } from 'src/model/backend/model/api';
import http from 'src/util/http';

const getField = async () => await http.get<GetFieldResponse>('field');

export default {
  getField,
};
