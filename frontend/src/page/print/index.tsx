import { MathJax } from 'better-react-mathjax';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Checkbox from 'src/component/Checkbox';
import IcPrint from 'src/image/ic-print.svg';
import { GetQuestionResponse } from 'src/model/backend/api';

const Print = () => {
  const state = useLocation().state as { question: GetQuestionResponse } | null;
  const componentRef = useRef(null);
  const [display, setDisplay] = useState<boolean>(true);
  const [width, setWidth] = useState<string>('8');
  const [showId, setShowId] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [showNumber, setShowNumber] = useState<boolean>(false);

  useEffect(() => {
    setDisplay(false);
    setTimeout(() => setDisplay(true), 10);
  }, [width, showAnswer]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="sticky top-0 z-10 bg-grey-50">
        <div className="mx-4 flex max-w-[1600px] flex-wrap justify-center gap-6 py-4 sm:mx-10 lg:mx-auto">
          <div className="flex items-center gap-2">
            <div>寬(cm):</div>
            <input
              className="rounded-md border border-grey-200 p-2"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
            />
          </div>
          <Checkbox
            label="顯示 ID"
            checked={showId}
            onChange={(e) => setShowId(e.target.checked)}
          />
          <Checkbox
            label="顯示題號"
            checked={showNumber}
            onChange={(e) => setShowNumber(e.target.checked)}
          />
          <Checkbox
            label="顯示答案"
            checked={showAnswer}
            onChange={(e) => setShowAnswer(e.target.checked)}
          />
          <Checkbox
            label="顯示邊框"
            checked={showBorder}
            onChange={(e) => setShowBorder(e.target.checked)}
          />
          <button
            className="flex items-center gap-1 rounded-md bg-indigo-500 py-2 pl-2 pr-4"
            onClick={handlePrint}
          >
            <img src={IcPrint} />
            <div className="text-white">列印</div>
          </button>
        </div>
      </div>
      {display && (
        <div ref={componentRef} className="mt-12">
          <MathJax>
            <div className="mx-auto flex flex-wrap justify-center">
              {state?.question.map((v, i) => (
                <div
                  key={v.id}
                  className="break-inside-avoid border-grey-900 p-2"
                  style={{
                    width: `${width === '' ? 8 : width}cm`,
                    border: `${showBorder ? '1px solid' : 'none'}`,
                  }}
                >
                  {showId && (
                    <div className="mb-2 text-sm text-grey-700">ID: {v.id.toUpperCase()}</div>
                  )}
                  {showNumber && <div>{i + 1}.</div>}
                  <div className="whitespace-pre-wrap">{v.content}</div>
                  <div className="flex flex-wrap">
                    {v.imageUrl?.map((o, i) => (
                      <div key={i}>
                        <img src={o} />
                      </div>
                    ))}
                  </div>
                  {showAnswer && <div className="mt-2 text-grey-700">Ans: {v.answer}</div>}
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
