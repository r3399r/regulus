import { Button, MenuItem, Pagination } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import MultiSelect from 'src/component/MultiSelect';
import useQuery from 'src/hook/useQuery';
import { GetQuestionResponse } from 'src/model/backend/api';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getFields, getQuestionList } from 'src/service/QuestionService';
import QuestionRow from './QuestionRow';

const DEFAULT_LIMIT = 50;

const AdminQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categoryList, setCatogeryList] = useState<Category[]>();
  const [chapterList, setChapterList] = useState<Chapter[]>();
  const query = useQuery<{
    id?: string;
    category?: string;
    chapter?: string;
    tag?: string;
    q?: string;
  }>();
  const [filterCategory, setFilterCategory] = useState<string[]>(query.category?.split(',') ?? []);
  const [filterChapter, setFilterChapter] = useState<string[]>(query.chapter?.split(',') ?? []);
  const [filterTag, setFilterTag] = useState<string>(query.tag ?? '');
  const [filterSearch, setFilterSearch] = useState<string>(query.q ?? '');
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
      id: query.id ? query.id : undefined,
      category: query.category ? query.category : undefined,
      chapter: query.chapter ? query.chapter : undefined,
      tag: query.tag ? query.tag : undefined,
      q: query.q ? query.q : undefined,
      limit: String(DEFAULT_LIMIT),
      offset: String(offset),
    })
      .then((res) => {
        setQuestion(res.data);
        setCount(res.count);
      })
      .catch((e) => dispatch(openSnackbar({ message: e, severity: 'error' })));
  }, [query, offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * DEFAULT_LIMIT);
  };

  if (!question || !categoryList || !chapterList)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Loading...</div>
    );

  return (
    <div>
      <div className="m-2">
        <Button variant="contained" onClick={() => navigate('./edit')}>
          新增題目
        </Button>
      </div>
      <div className="m-2 flex items-center gap-2">
        <MultiSelect
          label="類別"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as string[])}
        >
          {categoryList.map((o) => (
            <MenuItem key={o.id} value={o.name}>
              {o.name}
            </MenuItem>
          ))}
        </MultiSelect>
        <MultiSelect
          label="章節"
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value as string[])}
        >
          {chapterList.map((o) => (
            <MenuItem key={o.id} value={o.name}>
              {o.name}
            </MenuItem>
          ))}
        </MultiSelect>
        <input
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          placeholder="標籤"
          className="rounded-md border border-grey-200 p-2"
        />
        <input
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          placeholder="關鍵字"
          className="rounded-md border border-grey-200 p-2"
        />
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            navigate({
              search: createSearchParams({
                category: filterCategory.join(),
                chapter: filterChapter.join(),
                tag: filterTag,
                q: filterSearch,
              }).toString(),
            })
          }
        >
          搜尋
        </Button>
      </div>
      <div className="h-[1px] bg-grey-900" />
      <div className="sticky top-0 z-10">
        <div className="flex gap-1 p-2">
          <div className="w-1/12">ID</div>
          <div className="w-5/12">題目/答案</div>
          <div className="w-2/12">類別/章節</div>
          <div className="w-2/12">標籤/Youtube ID</div>
          <div className="w-1/12">有詳解</div>
          <div className="w-1/12" />
        </div>
        <div className="h-[1px] bg-grey-900" />
      </div>
      <MathJax>
        {question.map((v) => (
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
