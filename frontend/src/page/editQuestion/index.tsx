import { Button, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'src/component/Form';
import FormCheckbox from 'src/component/FormCheckbox';
import FormInput from 'src/component/FormInput';
import FormMultiSelect from 'src/component/FormMultiSelect';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { getFields } from 'src/service/QuestionService';

type QuestionForm = {
  content: string;
  answer: string;
  answerFormat: string;
  tag: string;
  youtube: string;
  hasSolution: boolean;
};

const EditQuestion = () => {
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
    console.log(data);
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
      <FormInput name="tag" label="標籤" helperText="以小逗號分隔" />
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
