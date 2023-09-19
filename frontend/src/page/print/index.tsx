import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { GetQuestionResponse } from 'src/model/backend/api';

const Print = () => {
  const state = useLocation().state as { question: GetQuestionResponse } | null;
  const componentRef = useRef(null);
  const [display, setDisplay] = useState<boolean>(true);
  const [width, setWidth] = useState<string>('8');
  const [showAnswerFormat, setShowAnswerFormat] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);

  useEffect(() => {
    setDisplay(false);
    setTimeout(() => setDisplay(true), 10);
  }, [width, showAnswer, showAnswerFormat]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="m-4 flex flex-wrap justify-center gap-4">
        <TextField
          label="寬(cm)"
          size="small"
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox checked={showAnswer} onChange={(e) => setShowAnswer(e.target.checked)} />
          }
          label={'顯示「答案」'}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showAnswerFormat}
              onChange={(e) => setShowAnswerFormat(e.target.checked)}
            />
          }
          label={'顯示「答案格式」'}
        />
        <Button variant="contained" onClick={handlePrint}>
          列印
        </Button>
      </div>
      {display && (
        <div ref={componentRef}>
          <MathJax>
            <div className="mx-auto my-0 flex flex-wrap justify-center">
              {state?.question.map((v) => (
                <div
                  key={v.id}
                  className="break-inside-avoid border border-solid border-black p-1"
                  style={{ width: `${width === '' ? 8 : width}cm` }}
                >
                  <div className="text-sm text-gray-500">ID: {v.id.toUpperCase()}</div>
                  <div>{v.content}</div>
                  <div className="flex flex-wrap">
                    {v.imageUrl?.map((o, i) => (
                      <div key={i}>
                        <img src={o} />
                      </div>
                    ))}
                  </div>
                  {showAnswerFormat && <div className="text-gray-500">Ans: {v.answerFormat}</div>}
                  {showAnswer && <div className="text-gray-500">Ans: {v.answer}</div>}
                </div>
              ))}
            </div>
          </MathJax>
        </div>
      )}
    </div>
  );
};

export default Print;
