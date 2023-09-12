import { Button, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import Form from 'src/component/Form';
import FormCheckbox from 'src/component/FormCheckbox';
import FormInput from 'src/component/FormInput';
import FormSelect from 'src/component/FormSelect';

type QuestionForm = {
  content: string;
  answer: string;
  answerFormat: string;
  tag: string;
  youtube: string;
};

const EditQuestion = () => {
  const methods = useForm<QuestionForm>();

  const onSubmit = (data: QuestionForm) => {
    console.log(data);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} className="m-4 flex flex-col gap-4">
      <div className="text-xl font-bold">題目編輯器</div>
      <FormInput name="content" label="內容" multiline required minRows={3} />
      <FormInput name="answer" label="答案" required />
      <FormInput name="answerFormat" label="答案格式" required />
      <div className="flex gap-4">
        <FormSelect name="category" label="類別">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
        </FormSelect>
        <FormSelect name="chapter" label="章節" required>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
        </FormSelect>
      </div>
      <FormInput name="tag" label="標籤" helperText="以逗號分隔無空白" />
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
