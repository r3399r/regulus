import { Button, Checkbox, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MultiSelect from 'src/component/MultiSelect';
import { GetQuestionResponse } from 'src/model/backend/api';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { updateQuestion } from 'src/service/QuestionService';

type Props = {
  question: GetQuestionResponse[0];
  chapterList: Chapter[];
  categoryList: Category[];
};

const QuestionRow = ({ question, chapterList, categoryList }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<string[]>(question.chapters.map((o) => o.name));
  const [category, setCategory] = useState<string[]>(question.categories.map((o) => o.name));
  const [tag, setTag] = useState<string>(question.tags.map((o) => o.name).join(','));
  const [youtube, setYoutube] = useState<string>(question.youtube ?? '');
  const [hasSolution, setHasSolution] = useState<boolean>(question.hasSolution);

  const onUpdate = () => {
    updateQuestion(question.id, { chapter, category, tag, youtube, hasSolution })
      .then(() =>
        dispatch(openSnackbar({ message: `${question.id} 編輯成功`, severity: 'success' })),
      )
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  };

  return (
    <div>
      <div className="flex gap-1 p-2">
        <div className="w-1/12">{question.id.toUpperCase()}</div>
        <div
          className="w-5/12 cursor-pointer"
          onClick={() => navigate(`/admin/question/edit?id=${question.id}`)}
        >
          <div className="whitespace-pre-wrap">{question.content}</div>
          <div className="flex flex-wrap">
            {question.imageUrl?.map((o, i) => (
              <div key={i}>
                <img src={o} />
              </div>
            ))}
          </div>
          <div className="mt-2">Ans: {question.answer}</div>
        </div>
        <div className="flex w-2/12 flex-col gap-3 py-2">
          <MultiSelect
            label="類別"
            value={category}
            onChange={(e) => setCategory(e.target.value as string[])}
          >
            {categoryList.map((o) => (
              <MenuItem key={o.id} value={o.name}>
                {o.name}
              </MenuItem>
            ))}
          </MultiSelect>
          <MultiSelect
            label="章節"
            value={chapter}
            onChange={(e) => setChapter(e.target.value as string[])}
          >
            {chapterList.map((o) => (
              <MenuItem key={o.id} value={o.name}>
                {o.name}
              </MenuItem>
            ))}
          </MultiSelect>
        </div>
        <div className="flex w-2/12 flex-col gap-3 py-2">
          <TextField
            fullWidth
            autoComplete="off"
            label="標籤"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <TextField
            fullWidth
            autoComplete="off"
            label="Youtube 影片 ID"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>
        <div className="w-1/12">
          <Checkbox checked={hasSolution} onChange={(e) => setHasSolution(e.target.checked)} />
        </div>
        <div className="w-1/12 py-2">
          <Button variant="contained" color="warning" onClick={onUpdate}>
            更新
          </Button>
        </div>
      </div>
      <div className="h-[1px] bg-grey-900" />
    </div>
  );
};

export default QuestionRow;
