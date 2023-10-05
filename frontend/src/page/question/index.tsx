import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button, Card, Chip, Pagination } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useQuery from 'src/hook/useQuery';
import { GetQuestionResponse } from 'src/model/backend/api';
import { openSnackbar } from 'src/redux/uiSlice';
import { getQuestionList } from 'src/service/QuestionService';

const DEFAULT_LIMIT = 50;

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
  const [count, setCount] = useState<number>();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setQuestion(undefined);
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

  if (question === undefined || count === undefined) return <></>;

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <div>搜尋結果: {count} 題</div>
        <Button
          variant="contained"
          onClick={() =>
            navigate('./print', { state: { question: question.filter((v) => selected.has(v.id)) } })
          }
          disabled={selected.size === 0}
        >
          列印設定
        </Button>
      </div>
      <MathJax>
        <div className="mt-2 flex flex-wrap gap-4">
          {question.map((v) => (
            <Card key={v.id} className="h-fit w-full sm:w-[calc(50%-8px)]">
              <div
                className={classNames('flex flex-col gap-2 p-4 cursor-pointer', {
                  '!bg-blue-100/30': selected.has(v.id),
                })}
                onClick={() => {
                  const tempSelected = new Set(selected);
                  if (tempSelected.has(v.id)) tempSelected.delete(v.id);
                  else tempSelected.add(v.id);
                  setSelected(tempSelected);
                }}
              >
                <div className="text-sm text-gray-500">ID: {v.id.toUpperCase()}</div>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    {v.categories.map((o) => (
                      <Chip
                        key={o.id}
                        label={o.name}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {v.chapters.map((o) => (
                      <Chip
                        key={o.id}
                        label={o.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {v.tags.map((o) => (
                      <Chip
                        key={o.id}
                        label={o.name}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </div>
                </div>
                <div>{`平均得分: ${v.average ? v.average + '/10' : '-'}`}</div>
                <div className="whitespace-pre-wrap">{v.content}</div>
                <div className="flex flex-wrap">
                  {v.imageUrl?.map((o, i) => (
                    <div key={i}>
                      <img src={o} />
                    </div>
                  ))}
                </div>
                <div>Ans: {v.answer}</div>
                <div className="flex gap-2">
                  <HistoryEduIcon
                    color={v.hasSolution ? 'inherit' : 'disabled'}
                    onClick={() => {
                      if (v.youtube === null) return;
                      window.open(
                        `https://blog.celestialstudio.net/posts/solution/${v.id}`,
                        '_blank',
                      );
                    }}
                  />
                  <YouTubeIcon
                    color={v.youtube ? 'inherit' : 'disabled'}
                    onClick={() => {
                      if (v.youtube === null) return;
                      window.open(`https://www.youtube.com/watch?v=${v.youtube}`, '_blank');
                    }}
                  />
                </div>
              </div>
            </Card>
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
