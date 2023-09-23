import { Card } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'src/model/backend/entity/UserEntity';
import { getAllUser } from 'src/service/UserService';

const UserPage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<User[]>();

  useEffect(() => {
    getAllUser().then((res) => setUserList(res));
  }, []);

  return (
    <div className="m-4 flex flex-col gap-4">
      <Card className="flex gap-1 p-4">
        <div className="w-1/4">姓名</div>
        <div className="w-1/4">Email</div>
        <div className="w-1/4">生日</div>
        <div className="w-1/4">建立於</div>
      </Card>
      {userList?.map((v) => (
        <Card key={v.id}>
          <div className="flex cursor-pointer gap-1 p-4" onClick={() => navigate(`/user/${v.id}`)}>
            <div className="w-1/4">{v.name}</div>
            <div className="w-1/4">{v.email}</div>
            <div className="w-1/4">{v.birthday}</div>
            <div className="w-1/4">
              {format(new Date(v.createdAt ?? ''), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserPage;
