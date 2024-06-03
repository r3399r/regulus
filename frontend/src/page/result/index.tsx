import { Button, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MultiSelect from 'src/component/MultiSelect';
import { User } from 'src/model/backend/entity/UserEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getUserList } from 'src/service/ResultService';

const Result = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [questionId, setQuestionId] = useState<string>('');
  const [isLock, setIsLock] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserList()
      .then((res) => setUserList(res))
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, []);

  return (
    <>
      <div className="flex items-center gap-4">
        <div>User List:</div>
        <div className="flex-1">
          <MultiSelect
            label="User"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value as string[])}
            disabled={isLock}
          >
            {userList.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.name}
              </MenuItem>
            ))}
          </MultiSelect>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>Question ID:</div>
        <div className="flex-1">
          <TextField
            fullWidth
            autoComplete="off"
            label="Question ID"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            disabled={isLock}
          />
        </div>
      </div>
      <Button variant="contained" onClick={() => setIsLock(!isLock)}>
        {isLock ? 'Unlock' : 'Lock'}
      </Button>
      <div>Note: User 及 Question 更改之後下方表格會清空</div>
    </>
  );
};

export default Result;
