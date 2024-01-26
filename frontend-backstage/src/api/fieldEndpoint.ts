import { GetFieldResponse, GetTagParams, GetTagResponse } from 'src/model/backend/api';
import http from 'src/util/http';

const getField = async () => await http.get<GetFieldResponse>('field');

const getFieldTag = async (params?: GetTagParams) =>
  await http.get<GetTagResponse>('field/tag', { params });

export default {
  getField,
  getFieldTag,
};
