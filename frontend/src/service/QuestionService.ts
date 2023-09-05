import questionEndpoint from 'src/api/questionEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getQuestionList = async () => {
  try {
    dispatch(startWaiting());
    const res = await questionEndpoint.getQuestion();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};
