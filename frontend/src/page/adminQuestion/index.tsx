import { Pagination } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useQuery from 'src/hook/useQuery';
import { GetQuestionResponse } from 'src/model/backend/api';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getFields, getQuestionList } from 'src/service/QuestionService';
import QuestionRow from './QuestionRow';

const DEFAULT_LIMIT = 50;

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
          <QuestionRow
            key={v.id}
            question={v}
            categoryList={categoryList}
            chapterList={chapterList}
          />
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
