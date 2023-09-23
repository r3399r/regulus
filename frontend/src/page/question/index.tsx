import { Button, Card, Chip, Pagination } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useQuery from 'src/hook/useQuery';
import { GetQuestionResponse } from 'src/model/backend/api';
import { openSnackbar } from 'src/redux/uiSlice';
import { getQuestionList } from 'src/service/QuestionService';

const DEFAULT_LIMIT = 10;

const QuestionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useQuery<{ id?: string }>();
  const [question, setQuestion] = useState<GetQuestionResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>();

  useEffect(() => {
    getQuestionList({ id, limit: String(DEFAULT_LIMIT), offset: String(offset) })
      .then((res) => {
        setQuestion(res.data);
        setCount(res.count);
      })
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, [id, offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * DEFAULT_LIMIT);
  };

  if (question === undefined || count === undefined) return <></>;

  return (
    <div className="p-2">
      <Button variant="contained" onClick={() => navigate('./print', { state: { question } })}>
        列印設定
      </Button>
      <MathJax>
        <div className="flex flex-wrap gap-4">
          {question.map((v) => (
            <Card key={v.id} className="flex h-fit w-full flex-col gap-2 p-4 sm:w-[calc(50%-8px)]">
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
              <div>{v.content}</div>
              <div className="flex flex-wrap">
                {v.imageUrl?.map((o, i) => (
                  <div key={i}>
                    <img src={o} />
                  </div>
                ))}
              </div>
              <div>Ans: {v.answer}</div>
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
