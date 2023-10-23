import { Pagination, Rating } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useQuery from 'src/hook/useQuery';
import IcArrow from 'src/image/ic-arrow.svg';
import IcCheckGrey from 'src/image/ic-check-grey.svg';
import IcCheckWhite from 'src/image/ic-check-white.svg';
import IcDoc from 'src/image/ic-doc.svg';
import IcFilter from 'src/image/ic-filter.svg';
import IcPrint from 'src/image/ic-print.svg';
import IcSearch from 'src/image/ic-search.svg';
import IcVideo from 'src/image/ic-video.svg';
import { GetQuestionResponse } from 'src/model/backend/api';
import { openSnackbar } from 'src/redux/uiSlice';
import { getQuestionList } from 'src/service/QuestionService';

const DEFAULT_LIMIT = 10;

const QuestionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, category, chapter, tag } = useQuery<{
    id?: string;
    category?: string;
    chapter?: string;
    tag?: string;
  }>();
  const [question, setQuestion] = useState<GetQuestionResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getQuestionList({
      id,
      category,
      chapter,
      tag,
      limit: String(DEFAULT_LIMIT),
      offset: String(offset),
    })
      .then((res) => {
        setQuestion(res.data);
        setCount(res.count);
      })
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, [id, category, chapter, tag, offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * DEFAULT_LIMIT);
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-grey-50">
        <div className="mx-4 flex max-w-[1600px] flex-wrap justify-between gap-x-2 gap-y-4 py-4 sm:mx-10 lg:mx-auto">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex">
                <div>
                  <img src={IcFilter} />
                </div>
                <div className="text-sm leading-[1.5] text-grey-700">篩選:</div>
              </div>
              <div className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2">
                <div>類別</div>
                <img src={IcArrow} />
              </div>
              <div className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2">
                <div>章節</div>
                <img src={IcArrow} />
              </div>
              <div className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2">
                <div>標籤</div>
                <img src={IcArrow} />
              </div>
              <div className="relative">
                <input className="rounded-md border border-grey-200 py-2 pl-9 pr-2" />
                <img src={IcSearch} className="absolute left-2 top-2" />
              </div>
            </div>
            <div>搜尋結果: {count} 題</div>
            <div className="cursor-pointer text-indigo-500 underline">清除</div>
          </div>
          <div>
            <button
              className="flex items-center gap-1 rounded-md bg-indigo-500 py-2 pl-2 pr-4"
              onClick={() => {
                if (!question) return;
                navigate('./print', {
                  state: { question: selected.map((v) => question.find((o) => o.id === v)) },
                });
              }}
              disabled={selected.length === 0}
            >
              <img src={IcPrint} />
              <div className="text-white">預覽列印</div>
            </button>
          </div>
        </div>
      </div>
      <MathJax>
        <div className="mx-4 mt-12 flex max-w-[1600px] flex-wrap gap-6 sm:mx-10 lg:mx-auto">
          {question?.map((v) => (
            <div key={v.id} className="h-min w-[calc(50%-12px)] bg-white p-6">
              <div className="mb-2 text-xs text-grey-600">ID: {v.id.toUpperCase()}</div>
              <div className="mb-2 flex flex-wrap gap-2">
                {v.categories.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-rose-100 px-3 py-[2px] text-xs leading-[1.5] text-rose-900"
                  >
                    {o.name}
                  </div>
                ))}
                {v.chapters.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-skyblue-100 px-3 py-[2px] text-xs leading-[1.5] text-skyblue-900"
                  >
                    {o.name}
                  </div>
                ))}
                {v.tags.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-grass-100 px-3 py-[2px] text-xs leading-[1.5] text-grass-900"
                  >
                    {o.name}
                  </div>
                ))}
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div>難易度:</div>
                {v.average ? (
                  <Rating value={6 - v.average} precision={0.1} readOnly size="small" />
                ) : (
                  <div>無資料</div>
                )}
              </div>
              <div className="whitespace-pre-wrap">{v.content}</div>
              <div className="flex flex-wrap">
                {v.imageUrl?.map((o, i) => (
                  <div key={i}>
                    <img src={o} />
                  </div>
                ))}
              </div>
              <div className="my-4">Ans: {v.answer}</div>
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-2">
                    {v.hasSolution && (
                      <img
                        className="cursor-pointer"
                        src={IcDoc}
                        onClick={() =>
                          window.open(
                            `https://blog.celestialstudio.net/posts/solution/${v.id}`,
                            '_blank',
                          )
                        }
                      />
                    )}
                    {v.youtube && (
                      <img
                        className="cursor-pointer"
                        src={IcVideo}
                        onClick={() =>
                          window.open(`https://www.youtube.com/watch?v=${v.youtube}`, '_blank')
                        }
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    className={classNames('py-1 pr-2 pl-3 rounded-md flex gap-1 items-center', {
                      'bg-indigo-500 text-white': selected.includes(v.id),
                      'bg-grey-200 text-grey-900': !selected.includes(v.id),
                    })}
                    onClick={() => {
                      let tempSelected = [...selected];
                      if (tempSelected.includes(v.id)) tempSelected.filter((o) => o !== v.id);
                      else tempSelected = [...tempSelected, v.id];
                      setSelected(tempSelected);
                    }}
                  >
                    <div className="text-sm leading-[1.5]">列印</div>
                    <img src={selected.includes(v.id) ? IcCheckWhite : IcCheckGrey} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MathJax>
      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(count / DEFAULT_LIMIT)}
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
    </div>
  );
};

export default QuestionPage;
