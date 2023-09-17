import { Card, Chip } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { useEffect, useState } from 'react';
import { GetQuestionResponse } from 'src/model/backend/api';
import { getQuestionList } from 'src/service/QuestionService';

const QuestionPage = () => {
  const [question, setQuestion] = useState<GetQuestionResponse>();

  useEffect(() => {
    getQuestionList().then((res) => setQuestion(res));
  }, []);

  return (
    <div className="p-2">
      <MathJax dynamic>
        <div className="flex flex-wrap gap-4">
          {question?.map((v) => (
            <Card key={v.id} className="w-[calc(50%-8px)] p-4">
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
              <div>Ans: {v.answerFormat}</div>
              <div className="mt-2">Ans: {v.answer}</div>
            </Card>
          ))}
        </div>
      </MathJax>
    </div>
  );
};

export default QuestionPage;
