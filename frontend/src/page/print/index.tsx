import { Button, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { GetQuestionResponse } from 'src/model/backend/api';

const Print = () => {
  const state = useLocation().state as { question: GetQuestionResponse } | null;
  const componentRef = useRef(null);
  const [width, setWidth] = useState<string>('8');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="m-4 flex gap-4">
        <TextField
          label="寬(cm)"
          size="small"
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <Button variant="contained" onClick={handlePrint}>
          列印
        </Button>
      </div>
      <div className="mx-auto my-0 flex flex-wrap justify-center" ref={componentRef}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Print;
