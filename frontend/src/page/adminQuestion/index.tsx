import { Button, Checkbox, MenuItem, Pagination, TextField } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MultiSelect from 'src/component/MultiSelect';
import useQuery from 'src/hook/useQuery';
import { GetQuestionResponse } from 'src/model/backend/api';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getFields, getQuestionList } from 'src/service/QuestionService';

const DEFAULT_LIMIT = 10;

const AdminQuestion = () => {
  const dispatch = useDispatch();
  const [categoryList, setCatogeryList] = useState<Category[]>();
  const [chapterList, setChapterList] = useState<Chapter[]>();
  const { id, category, chapter, tag } = useQuery<{
    id?: string;
    category?: string;
    chapter?: string;
    tag?: string;
  }>();
  const [question, setQuestion] = useState<GetQuestionResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getFields().then((res) => {
      setCatogeryList(res.category);
      setChapterList(res.chapter);
    });
  }, []);

  useEffect(() => {
    setQuestion(undefined);
    getQuestionList({
      id,
      category,
      chapter,
      tag,
      limit: String(DEFAULT_LIMIT),
      offset: String(offset),
    })
      .then((res) => {
        setQuestion(res.data);
        setCount(res.count);
      })
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, [id, category, chapter, tag, offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * DEFAULT_LIMIT);
  };

  if (!categoryList || !chapterList) return <></>;

  return (
    <div className="mx-2">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex gap-1 py-2">
          <div className="w-1/12">ID</div>
          <div className="w-5/12">題目/答案格式/答案</div>
          <div className="w-2/12">類別/章節</div>
          <div className="w-2/12">標籤/Youtube ID</div>
          <div className="w-1/12">有詳解</div>
          <div className="w-1/12" />
        </div>
        <div className="h-[1px] bg-black" />
      </div>
      <MathJax>
        {question?.map((v) => (
          <div key={v.id}>
            <div className="flex gap-1 py-2">
              <div className="w-1/12">{v.id.toUpperCase()}</div>
              <div className="w-5/12">
                <div className="whitespace-pre-wrap">{v.content}</div>
                <div className="flex flex-wrap">
                  {v.imageUrl?.map((o, i) => (
                    <div key={i}>
                      <img src={o} />
                    </div>
                  ))}
                </div>
                <div>Answer Format: {v.answerFormat}</div>
                <div>Answer: {v.answer}</div>
              </div>
              <div className="flex w-2/12 flex-col gap-3 py-2">
                <MultiSelect label="類別" defaultValue={v.categories.map((o) => o.name)}>
                  {categoryList.map((o) => (
                    <MenuItem key={o.id} value={o.name}>
                      {o.name}
                    </MenuItem>
                  ))}
                </MultiSelect>
                <MultiSelect label="章節" defaultValue={v.chapters.map((o) => o.name)}>
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
                  value={v.tags.map((o) => o.name).join(',')}
                />
                <TextField fullWidth autoComplete="off" label="Youtube 影片 ID" value={v.youtube} />
              </div>
              <div className="w-1/12">
                <Checkbox checked={v.hasSolution} />
              </div>
              <div className="w-1/12 py-2">
                <Button variant="contained" color="warning">
                  更新
                </Button>
              </div>
            </div>
            <div className="h-[1px] bg-black" />
          </div>
        ))}
      </MathJax>
      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(count / DEFAULT_LIMIT)}
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
    </div>
  );
};

export default AdminQuestion;
