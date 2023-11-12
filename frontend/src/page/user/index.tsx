import { Card } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User } from 'src/model/backend/entity/UserEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getAllUser } from 'src/service/UserService';

const UserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userList, setUserList] = useState<User[]>();

  useEffect(() => {
    getAllUser()
      .then((res) => setUserList(res))
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, []);

  return (
    <div className="m-4 flex flex-col gap-4">
      <Card className="flex gap-1 p-4">
        <div className="w-1/4">姓名</div>
        <div className="w-1/4">Email</div>
        <div className="w-1/4">生日</div>
        <div className="w-1/4">更新於</div>
      </Card>
      {userList?.map((v) => (
        <Card key={v.id}>
          <div className="flex cursor-pointer gap-1 p-4" onClick={() => navigate(`/user/${v.id}`)}>
            <div className="w-1/4">{v.name}</div>
            <div className="w-1/4">{v.email}</div>
            <div className="w-1/4">{v.birthday}</div>
            <div className="w-1/4">
              {format(new Date(v.updatedAt ?? ''), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserPage;
