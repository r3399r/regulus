import resultEndpoint from 'src/api/resultEndpoint';
import { ResultForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getAllUser } from './UserService';

export const getUserList = async () => await getAllUser();

export const postResults = async (data: ResultForm) => {
  try {
    dispatch(startWaiting());
    await resultEndpoint.postResult(
      data.map((v) => ({
        questionId: v.questionId,
        userId: v.userId,
        score: +v.score,
      })),
    );
  } finally {
    dispatch(finishWaiting());
  }
};
