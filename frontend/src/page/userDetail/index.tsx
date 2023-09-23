import { Card, Chip } from '@mui/material';
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetUserIdResponse } from 'src/model/backend/api';
import { openSnackbar } from 'src/redux/uiSlice';
import { getUserById } from 'src/service/UserService';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<GetUserIdResponse>();

  useEffect(() => {
    if (id === undefined) return;
    getUserById(id)
      .then((res) => setUser(res))
      .catch(() => {
        dispatch(openSnackbar({ message: 'invalid user id', severity: 'error' }));
        navigate('question');
      });
  }, [id]);

  if (!user) return <></>;

  return (
    <div className="m-4 flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="w-[60px]">ID</div>
        <div>{user.id}</div>
      </div>
      <div className="flex gap-4">
        <div className="w-[60px]">姓名</div>
        <div>{user.name}</div>
      </div>
      <div className="flex gap-4">
        <div className="w-[60px]">Email</div>
        <div>{user.email}</div>
      </div>
      <div className="flex gap-4">
        <div className="w-[60px]">生日</div>
        <div>{user.birthday}</div>
      </div>
      <Card className="p-4">{user.memo}</Card>
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1">
          <Radar
            data={{
              labels: user.categoryScore.map((c) => c.name),
              datasets: [
                {
                  data: user.categoryScore.map((c) => c.score * 10),
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                },
              },
            }}
          />
        </div>
        <div className="flex-1">
          <Radar
            data={{
              labels: user.chapterScore.map((c) => c.name),
              datasets: [
                {
                  data: user.chapterScore.map((c) => c.score * 10),
                  backgroundColor: 'rgba(60, 179, 113, 0.2)',
                  borderColor: 'rgba(60, 179, 113, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                },
              },
            }}
          />
        </div>
      </div>
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex gap-2 font-bold">
          <div className="w-1/4">ID</div>
          <div className="w-1/4">章節</div>
          <div className="w-1/4">分數</div>
          <div className="w-1/4">日期</div>
        </div>
        {user.results.map((v) => (
          <div
            className="flex cursor-pointer gap-2"
            key={v.id}
            onClick={() => navigate(`/question?id=${v.questionId}`)}
          >
            <div className="w-1/4">{v.questionId.toUpperCase()}</div>
            <div className="flex w-1/4 gap-2">
              {v.question.chapters.map((o) => (
                <Chip key={o.id} label={o.name} size="small" color="primary" variant="outlined" />
              ))}
            </div>
            <div className="w-1/4">{v.score * 10}</div>
            <div className="w-1/4">{format(new Date(v.createdAt ?? ''), 'yyyy/MM/dd')}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default UserDetail;
