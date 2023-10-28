import { Button, MenuItem, TextField } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Form from 'src/component/Form';
import FormCheckbox from 'src/component/FormCheckbox';
import FormInput from 'src/component/FormInput';
import FormMultiSelect from 'src/component/FormMultiSelect';
import useQuery from 'src/hook/useQuery';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { QuestionForm } from 'src/model/Form';
import { openSnackbar } from 'src/redux/uiSlice';
import {
  addNewQuestion,
  editQuestion,
  getFields,
  getQuestionById,
} from 'src/service/QuestionService';

const adminQuestionEdit = () => {
  const dispatch = useDispatch();
  const methods = useForm<QuestionForm>();
  const [category, setCatogery] = useState<Category[]>();
  const [chapter, setChapter] = useState<Chapter[]>();
  const { id } = useQuery<{ id?: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File[]>();
  const [imageUrl, setImageUrl] = useState<string[] | null>(null);
  const [preview, setPreview] = useState<boolean>(true);

  useEffect(() => {
    getFields().then((res) => {
      setCatogery(res.category);
      setChapter(res.chapter);
    });
  }, []);

  useEffect(() => {
    if (id === undefined) return;
    getQuestionById(id).then((res) => {
      if (res.length !== 1) return;
      methods.setValue('content', res[0].content);
      methods.setValue('answer', res[0].answer ?? '');
      methods.setValue('category', res[0].categories.map((v) => v.name).join(','));
      methods.setValue('chapter', res[0].chapters.map((v) => v.name).join(','));
      methods.setValue('tag', res[0].tags.map((v) => v.name).join(','));
      methods.setValue('youtube', res[0].youtube ?? '');
      methods.setValue('hasSolution', res[0].hasSolution);
      setImageUrl(res[0].imageUrl);
    });
  }, [id]);

  useEffect(() => {
    setPreview(false);
    setTimeout(() => setPreview(true), 10);
  }, [methods.watch('content'), methods.watch('answer')]);

  const onSubmit = (data: QuestionForm) => {
    if (id === undefined)
      addNewQuestion(data, image)
        .then(() => {
          dispatch(openSnackbar({ message: '新增成功', severity: 'success' }));
          methods.reset();
          setImage(undefined);
        })
        .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
    else
      editQuestion(id, data, image)
        .then(() => dispatch(openSnackbar({ message: '編輯成功', severity: 'success' })))
        .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  };

  if (!category || !chapter) return <></>;

  return (
    <div className="flex gap-4">
      <Form methods={methods} onSubmit={onSubmit} className="my-4 ml-4 flex w-1/2 flex-col gap-4">
        <div className="text-xl font-bold">題目編輯器</div>
        <FormInput
          name="content"
          label="內容"
          multiline
          required
          minRows={3}
          helperText="MathJax: \(...\) \[...\]"
        />
        {image?.map((v, i) => (
          <Button
            key={i}
            variant="contained"
            color="error"
            onClick={() => {
              if (image.length === 1) setImage(undefined);
              else setImage(image.filter((o) => o !== v));
            }}
          >{`刪除 ${v.name}`}</Button>
        ))}
        <TextField label="圖片" onClick={() => inputRef.current?.click()} />
        <FormInput name="answer" label="答案" />
        <div className="flex gap-4">
          <FormMultiSelect name="category" label="類別">
            {category.map((v) => (
              <MenuItem key={v.id} value={v.name}>
                {v.name}
              </MenuItem>
            ))}
          </FormMultiSelect>
          <FormMultiSelect name="chapter" label="章節">
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
        {id === undefined && (
          <div className="flex gap-4">
            <FormInput className="flex-1" name="defaultScore" label="預設總分" type="number" />
            <FormInput className="flex-1" name="defaultCount" label="預設總人數" type="number" />
          </div>
        )}
        <div>
          <Button type="submit" variant="contained">
            {id === undefined ? '新增' : '編輯'}
          </Button>
        </div>
      </Form>
      <div className="my-4 mr-4 w-1/2">
        <div className="text-xl font-bold">預覽</div>
        {preview && (
          <MathJax dynamic>
            <div className="mt-4 whitespace-pre-wrap">{methods.watch('content')}</div>
            <div className="flex flex-wrap">
              {image
                ? image.map((v, i) => (
                    <div key={i}>
                      <img src={URL.createObjectURL(v)} />
                    </div>
                  ))
                : imageUrl?.map((v, i) => (
                    <div key={i}>
                      <img src={v} />
                    </div>
                  ))}
            </div>
            <div className="flex gap-2">
              <div>Ans:</div>
              <div>{methods.watch('answer')}</div>
            </div>
          </MathJax>
        )}
      </div>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0)
            setImage([...(image ?? []), ...e.target.files]);
        }}
        ref={inputRef}
        className="hidden"
        accept="image/*"
        multiple={true}
      />
    </div>
  );
};

export default adminQuestionEdit;
