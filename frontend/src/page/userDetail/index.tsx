import { Rating, Slider } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetUserIdResponse } from 'src/model/backend/api';
import { openSnackbar } from 'src/redux/uiSlice';
import { getUserById } from 'src/service/UserService';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<GetUserIdResponse>();
  const [currentDate, setCurrentDate] = useState<number>();

  const ts = useMemo(() => {
    if (detail === undefined || currentDate === undefined || detail.timeseries.length === 0)
      return null;

    return detail.timeseries[currentDate - 1];
  }, [detail, currentDate]);

  const [categoryLabels, categoryScore, chapterLabels, chapterScore] = useMemo(() => {
    if (ts === null) return [[], [], [], []];

    return [
      ts.category.map((v) => v.name),
      ts.category.map((v) => v.score),
      ts.chapter.map((v) => v.name),
      ts.chapter.map((v) => v.score),
    ];
  }, [ts]);

  useEffect(() => {
    if (id === undefined) return;
    getUserById(id)
      .then((res) => {
        setDetail(res);
        setCurrentDate(res.timeseries.length);
      })
      .catch(() => {
        dispatch(openSnackbar({ message: 'invalid user id', severity: 'error' }));
      });
  }, [id]);

  if (!detail)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Loading...</div>
    );

  return (
    <div className="mx-4 my-16 flex max-w-[1600px] flex-col gap-8 sm:mx-10 lg:mx-auto">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex flex-col gap-4 border-l-[3px] border-solid border-grey-900 bg-white px-6 py-4 sm:flex-1">
          <div className="flex">
            <div className="w-14 sm:w-20">ID</div>
            <div className="flex-1 break-all">{detail.user.id}</div>
          </div>
          <div className="flex">
            <div className="w-14 sm:w-20">姓名</div>
            <div className="flex-1 break-all">{detail.user.name}</div>
          </div>
          <div className="flex">
            <div className="w-14 sm:w-20">Email</div>
            <div className="flex-1 break-all">{detail.user.email}</div>
          </div>
          <div className="flex">
            <div className="w-14 sm:w-20">生日</div>
            <div className="flex-1 break-all">{detail.user.birthday}</div>
          </div>
        </div>
        <div className="whitespace-pre border-l-[3px] border-solid border-grey-900 bg-white px-6 py-4 sm:flex-1">
          {detail.user.memo}
        </div>
      </div>
      <div className="relative flex flex-col rounded-lg bg-white sm:flex-row">
        <div className="flex-1">
          <Radar
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryScore,
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
                  pointLabels: {
                    font: { size: 12 },
                  },
                  ticks: { stepSize: 2 },
                },
              },
            }}
          />
        </div>
        <div className="flex-1">
          <Radar
            data={{
              labels: chapterLabels,
              datasets: [
                {
                  data: chapterScore,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                  pointLabels: {
                    font: { size: 12 },
                  },
                  ticks: { stepSize: 2 },
                },
              },
            }}
          />
        </div>
        {ts && (
          <>
            <div className="absolute left-1/2 top-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 gap-4 sm:bottom-0 sm:top-auto sm:-translate-y-0">
              <Slider
                step={1}
                marks
                min={1}
                value={currentDate}
                max={detail.timeseries.length}
                onChange={(e, v) => setCurrentDate(v as number)}
              />
            </div>
            <div className="absolute left-4 top-4 sm:left-1/2 sm:-translate-x-1/2">
              {format(new Date(ts.date), 'yyyy/MM/dd')}
            </div>
          </>
        )}
      </div>
      <MathJax dynamic>
        <div className="hidden sm:block">
          <div className="flex border-b border-solid border-grey-700 text-[14px] leading-[1.5] text-grey-500">
            <div className="w-2/12 px-2 pb-2 pt-4">ID</div>
            <div className="w-2/12 px-2 pb-2 pt-4">作答日期</div>
            <div className="w-1/12 px-2 pb-2 pt-4">分數(0~10)</div>
            <div className="w-7/12 px-2 pb-2 pt-4">內容</div>
          </div>
          {detail.results.map((v) => (
            <div
              key={v.id}
              className="flex border-b border-solid border-grey-300 text-[14px] leading-[1.5]"
            >
              <div className="w-2/12 px-2 py-4">{v.questionId.toUpperCase()}</div>
              <div className="w-2/12 px-2 py-4">
                {v.examDate ? format(new Date(v.examDate), 'yyyy/MM/dd') : '未知'}
              </div>
              <div className="w-1/12 px-2 py-4">{v.score}</div>
              <div className="w-7/12 px-2 py-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  {v.question.categories.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-[30px] bg-rose-100 px-3 py-[2px] text-xs leading-[1.5] text-rose-900"
                    >
                      {o.name}
                    </div>
                  ))}
                  {v.question.chapters.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-[30px] bg-skyblue-100 px-3 py-[2px] text-xs leading-[1.5] text-skyblue-900"
                    >
                      {o.name}
                    </div>
                  ))}
                </div>
                <div className="mb-4 flex items-center gap-2 text-sm leading-[1.5] text-grey-600">
                  <div>難易度:</div>
                  {v.difficulty !== null ? (
                    <Rating value={v.difficulty} readOnly size="small" precision={0.1} />
                  ) : (
                    <div>無資料</div>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{v.question.content}</div>
                <div className="flex flex-wrap">
                  {v.imageUrl?.map((o, i) => (
                    <div key={i}>
                      <img src={o} />
                    </div>
                  ))}
                </div>
                <div className="mt-4">Ans: {v.question.answer}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-solid border-grey-700 sm:hidden">
          {detail.results.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-4 border-b border-solid border-grey-300 pb-4 pt-6"
            >
              <div className="flex">
                <div className="flex w-1/2 gap-2">
                  <div className="text-[14px] leading-[1.5] text-grey-500">ID</div>
                  <div className="text-[14px] leading-[1.5] text-grey-700">
                    {v.questionId.toUpperCase()}
                  </div>
                </div>
                <div className="flex w-1/2 gap-2">
                  <div className="text-[14px] leading-[1.5] text-grey-500">作答日期</div>
                  <div className="text-[14px] leading-[1.5]">
                    {v.examDate ? format(new Date(v.examDate), 'yyyy/MM/dd') : '未知'}
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex w-1/2 gap-2">
                  <div className="text-[14px] leading-[1.5] text-grey-500">分數(0~10)</div>
                  <div className="text-[14px] leading-[1.5]">{v.score}</div>
                </div>
                <div className="flex w-1/2 gap-2">
                  <div className="text-[14px] leading-[1.5] text-grey-500">難易度</div>
                  {v.difficulty !== null ? (
                    <Rating value={v.difficulty} readOnly size="small" precision={0.1} />
                  ) : (
                    <div>無資料</div>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                {v.question.categories.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-rose-100 px-3 py-[2px] text-xs leading-[1.5] text-rose-900"
                  >
                    {o.name}
                  </div>
                ))}
                {v.question.chapters.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-skyblue-100 px-3 py-[2px] text-xs leading-[1.5] text-skyblue-900"
                  >
                    {o.name}
                  </div>
                ))}
              </div>
              <div className="whitespace-pre-wrap">{v.question.content}</div>
              <div className="flex flex-wrap">
                {v.imageUrl?.map((o, i) => (
                  <div key={i}>
                    <img src={o} />
                  </div>
                ))}
              </div>
              <div>Ans: {v.question.answer}</div>
            </div>
          ))}
        </div>
      </MathJax>
    </div>
  );
};

export default UserDetail;
