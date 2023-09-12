import { Button, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Form from 'src/component/Form';
import FormCheckbox from 'src/component/FormCheckbox';
import FormInput from 'src/component/FormInput';
import FormMultiSelect from 'src/component/FormMultiSelect';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { QuestionForm } from 'src/model/Form';
import { openSnackbar } from 'src/redux/uiSlice';
import { addNewQuestion, getFields } from 'src/service/QuestionService';

const EditQuestion = () => {
  const dispatch = useDispatch();
  const methods = useForm<QuestionForm>();
  const [category, setCatogery] = useState<Category[]>();
  const [chapter, setChapter] = useState<Chapter[]>();

  useEffect(() => {
    getFields().then((res) => {
      setCatogery(res.category);
      setChapter(res.chapter);
    });
  }, []);

  const onSubmit = (data: QuestionForm) => {
    addNewQuestion(data)
      .then(() => dispatch(openSnackbar({ message: '新增成功', severity: 'success' })))
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })))
      .finally(() => methods.reset());
  };

  if (!category || !chapter) return <></>;

  return (
    <Form methods={methods} onSubmit={onSubmit} className="m-4 flex flex-col gap-4">
      <div className="text-xl font-bold">題目編輯器</div>
      <FormInput name="content" label="內容" multiline required minRows={3} />
      <FormInput name="answer" label="答案" required />
      <FormInput name="answerFormat" label="答案格式" required />
      <div className="flex gap-4">
        <FormMultiSelect name="category" label="類別">
          {category.map((v) => (
            <MenuItem key={v.id} value={v.name}>
              {v.name}
            </MenuItem>
          ))}
        </FormMultiSelect>
        <FormMultiSelect name="chapter" label="章節" required>
          {chapter.map((v) => (
            <MenuItem key={v.id} value={v.name}>
              {v.name}
            </MenuItem>
          ))}
        </FormMultiSelect>
      </div>
      <FormInput name="tag" label="標籤" helperText="以小逗號分隔" required />
      <FormInput name="youtube" label="Youtube 影片 ID" />
      <div>
        <FormCheckbox name="hasSolution" label="有詳解" />
      </div>
      <div>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EditQuestion;
