import { Button, Card, Chip } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'src/redux/store';
import { loadQuestionList } from 'src/service/QuestionService';

const QuestionPage = () => {
  const navigate = useNavigate();
  const { question } = useSelector((rootState: RootState) => rootState.api);

  useEffect(() => {
    loadQuestionList();
  }, []);

  return (
    <div className="p-2">
      <Button variant="contained" onClick={() => navigate('./print', { state: { question } })}>
        列印設定
      </Button>
      {question && (
        <MathJax>
          <div className="flex flex-wrap gap-4">
            {question.map((v) => (
              <Card key={v.id} className="flex h-fit w-[calc(50%-8px)] flex-col gap-2 p-4">
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
      )}
    </div>
  );
};

export default QuestionPage;
