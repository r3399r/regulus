import { Button, MenuItem, TextField } from '@mui/material';
import classNames from 'classnames';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import MultiSelect from 'src/component/MultiSelect';
import { User } from 'src/model/backend/entity/UserEntity';
import { ResultForm } from 'src/model/Form';
import { openSnackbar } from 'src/redux/uiSlice';
import { getUserList, postResults } from 'src/service/ResultService';

const reducer = (state: ResultForm, action: { type: string; payload: Partial<ResultForm[0]> }) => {
  switch (action.type) {
    case 'add':
      if (
        state.find(
          (v) => v.questionId === action.payload.questionId && v.userId === action.payload.userId,
        )
      )
        return state.map((v) =>
          v.questionId === action.payload.questionId && v.userId === action.payload.userId
            ? {
                questionId: action.payload.questionId,
                userId: action.payload.userId,
                score: action.payload.score ?? '0',
              }
            : v,
        );

      return [
        ...state,
        {
          questionId: action.payload.questionId ?? '',
          userId: action.payload.userId ?? '',
          score: action.payload.score ?? '0',
        },
      ];
    case 'remove':
      return state.filter(
        (v) => v.questionId !== action.payload.questionId || v.userId !== action.payload.userId,
      );
    default:
      return [];
  }
};

const Result = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [userId, setUserId] = useState<string[]>([]);
  const [questionId, setQuestionId] = useState<string>('');
  const [isUnlock, setIsUnlock] = useState<boolean>(false);
  const dispatch = useDispatch();
  const questionList = useMemo(() => questionId.replace(/\s/g, '').split(','), [questionId]);
  const [state, setState] = useReducer(reducer, []);
  const disabled = useMemo(
    () =>
      state.length !== userId.length * questionList.length ||
      !!state.find((v) => +v.score > 10 || +v.score < 0),
    [state, userId, questionList],
  );

  useEffect(() => {
    getUserList()
      .then((res) => setUserList(res))
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, []);

  const onSubmit = () => {
    postResults(state)
      .then(() => {
        dispatch(openSnackbar({ message: 'Success', severity: 'success' }));
        setState({ type: 'reset', payload: {} });
        setIsUnlock(false);
      })
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  };

  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        <div>User List:</div>
        <div className="flex-1">
          <MultiSelect
            label="User"
            value={userId}
            onChange={(e) => {
              setState({ type: 'reset', payload: {} });
              setUserId(e.target.value as string[]);
            }}
            disabled={isUnlock}
          >
            {userList.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.name}
              </MenuItem>
            ))}
          </MultiSelect>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div>Question ID:</div>
        <div className="flex-1">
          <TextField
            fullWidth
            autoComplete="off"
            label="Question ID"
            value={questionId}
            onChange={(e) => {
              setState({ type: 'reset', payload: {} });
              setQuestionId(e.target.value);
            }}
            disabled={isUnlock}
          />
        </div>
      </div>
      <Button
        variant="contained"
        onClick={() => {
          setState({ type: 'reset', payload: {} });
          setIsUnlock(!isUnlock);
        }}
      >
        {isUnlock ? 'Unlock' : 'Lock'}
      </Button>
      <div className="my-4">Note: 下方表格會在 UNLOCK 之後清空</div>
      {isUnlock && (
        <>
          <table className="mb-4 border-2">
            <thead>
              <tr>
                <th className="border" />
                {userId.map((u) => {
                  const user = userList.find((v) => v.id === u);

                  return (
                    <th className="m-0 whitespace-nowrap border p-0" key={u}>
                      {user?.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {questionList.map((v) => (
                <tr key={v} className="m-0 whitespace-nowrap p-0">
                  <th className="border">{v}</th>
                  {userId.map((u) => {
                    const res = state.find((s) => s.questionId === v && s.userId === u);

                    return (
                      <td
                        key={u}
                        className={classNames('border p-1 text-center', {
                          'bg-grass-100': res && +res.score >= 0 && +res.score <= 10,
                          'bg-rose-100': !res || +res.score < 0 || +res.score > 10,
                        })}
                      >
                        <input
                          className="w-14 py-1 pl-2 pr-1"
                          type="number"
                          onChange={(e) => {
                            console.log(e.target.value.length);
                            if (e.target.value.length === 0)
                              setState({
                                type: 'remove',
                                payload: {
                                  questionId: v,
                                  userId: u,
                                },
                              });
                            else
                              setState({
                                type: 'add',
                                payload: {
                                  questionId: v,
                                  userId: u,
                                  score: e.target.value,
                                },
                              });
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="contained" onClick={onSubmit} disabled={disabled}>
            Submit
          </Button>
        </>
      )}
    </>
  );
};

export default Result;
