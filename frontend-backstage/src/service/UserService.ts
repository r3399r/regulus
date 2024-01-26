import userEndpoint from 'src/api/userEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getAllUser = async () => {
  try {
    dispatch(startWaiting());
    const res = await userEndpoint.getUser();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getUserById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const res = await userEndpoint.getUserId(id);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};
