import { Pagination, Rating } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import useQuery from 'src/hook/useQuery';
import IcArrow from 'src/image/ic-arrow.svg';
import IcCheckGrey from 'src/image/ic-check-grey.svg';
import IcCheckWhite from 'src/image/ic-check-white.svg';
import IcDoc from 'src/image/ic-doc.svg';
import IcFilter from 'src/image/ic-filter.svg';
import IcPrint from 'src/image/ic-print.svg';
import IcSearch from 'src/image/ic-search.svg';
import IcVideo from 'src/image/ic-video.svg';
import { GetQuestionResponse } from 'src/model/backend/api';
import { Category } from 'src/model/backend/entity/CategoryEntity';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';
import { openSnackbar } from 'src/redux/uiSlice';
import { getFields, getQuestionList } from 'src/service/QuestionService';
import ModalCategory from './ModalCategory';
import ModalChapter from './ModalChapter';
import ModalTag from './ModalTag';

const DEFAULT_LIMIT = 50;

const QuestionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery<{
    id?: string;
    category?: string;
    chapter?: string;
    tag?: string;
    q?: string;
  }>();
  const [question, setQuestion] = useState<GetQuestionResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [selected, setSelected] = useState<GetQuestionResponse>([]);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openChapter, setOpenChapter] = useState<boolean>(false);
  const [openTag, setOpenTag] = useState<boolean>(false);
  const [categoryList, setCatogeryList] = useState<Category[]>();
  const [chapterList, setChapterList] = useState<Chapter[]>();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    getFields().then((res) => {
      setCatogeryList(res.category);
      setChapterList(res.chapter);
    });
  }, []);

  useEffect(() => {
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

  const resetPagination = () => {
    setPage(1);
    setOffset(0);
  };

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
      <div className="bg-grey-50 sm:sticky sm:top-0 sm:z-10">
        <div className="mx-4 flex max-w-[1600px] flex-wrap justify-between gap-x-2 gap-y-4 py-4 sm:mx-10 lg:mx-auto">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex">
                <div>
                  <img src={IcFilter} />
                </div>
                <div className="text-sm leading-[1.5] text-grey-700">篩選:</div>
              </div>
              <div
                className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2"
                onClick={() => setOpenCategory(true)}
              >
                <div>類別</div>
                <img src={IcArrow} />
              </div>
              <div
                className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2"
                onClick={() => setOpenChapter(true)}
              >
                <div>章節</div>
                <img src={IcArrow} />
              </div>
              <div
                className="flex cursor-pointer gap-1 rounded-md border border-solid border-grey-300 bg-white p-2"
                onClick={() => setOpenTag(true)}
              >
                <div>標籤</div>
                <img src={IcArrow} />
              </div>
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  resetPagination();
                  navigate({ search: createSearchParams({ ...query, q: search }).toString() });
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-md border border-grey-200 py-2 pl-9 pr-2"
                />
                <img src={IcSearch} className="absolute left-2 top-2" />
              </form>
            </div>
            <div>搜尋結果: {count} 題</div>
          </div>
          <div>
            <button
              className="flex items-center gap-1 rounded-md bg-indigo-500 py-2 pl-2 pr-4"
              onClick={() => {
                navigate('./print', {
                  state: { question: selected },
                });
              }}
              disabled={selected.length === 0}
            >
              <img src={IcPrint} />
              <div className="text-white">預覽列印</div>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-4 flex h-12 max-w-[1600px] flex-wrap items-center gap-2 sm:mx-10 lg:mx-auto">
        {(query.category || query.chapter || query.tag) && (
          <div
            className="cursor-pointer rounded-md bg-grey-200 px-2 py-[2px] text-xs leading-[1.5]"
            onClick={() => {
              resetPagination();
              setSearch('');
              navigate({ search: createSearchParams({}).toString() });
            }}
          >
            清除
          </div>
        )}
        {[
          ...(query.category?.split(',') ?? []),
          ...(query.chapter?.split(',') ?? []),
          ...(query.tag?.split(',') ?? []),
        ].map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </div>
      <MathJax dynamic>
        <div className="mx-4 flex max-w-[1600px] flex-wrap gap-6 sm:mx-10 lg:mx-auto">
          {question.map((v) => (
            <div
              key={v.id}
              className={classNames('h-min w-full bg-white p-6 sm:w-[calc(50%-12px)] rounded-lg', {
                'outline-indigo-500 outline outline-1':
                  selected.findIndex((o) => o.id === v.id) >= 0,
              })}
            >
              <div className="mb-2 text-xs text-grey-600">ID: {v.id.toUpperCase()}</div>
              <div className="mb-2 flex flex-wrap gap-2">
                {v.categories.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-rose-100 px-3 py-[2px] text-xs leading-[1.5] text-rose-900"
                  >
                    {o.name}
                  </div>
                ))}
                {v.chapters.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-skyblue-100 px-3 py-[2px] text-xs leading-[1.5] text-skyblue-900"
                  >
                    {o.name}
                  </div>
                ))}
                {v.tags.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[30px] bg-grass-100 px-3 py-[2px] text-xs leading-[1.5] text-grass-900"
                  >
                    {o.name}
                  </div>
                ))}
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm leading-[1.5] text-grey-600">
                <div>難易度:</div>
                {v.difficulty !== null ? (
                  <Rating value={v.difficulty} readOnly size="small" precision={0.1} />
                ) : (
                  <div>無資料</div>
                )}
              </div>
              <div className="whitespace-pre-wrap">{v.content}</div>
              <div className="flex flex-wrap">
                {v.imageUrl?.map((o, i) => (
                  <div key={i}>
                    <img src={o} />
                  </div>
                ))}
              </div>
              <div className="my-4">Ans: {v.answer}</div>
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-2">
                    {v.hasSolution && (
                      <img
                        className="cursor-pointer"
                        src={IcDoc}
                        onClick={() =>
                          window.open(
                            `https://blog.celestialstudio.net/posts/solution/${v.id}`,
                            '_blank',
                          )
                        }
                      />
                    )}
                    {v.youtube && (
                      <img
                        className="cursor-pointer"
                        src={IcVideo}
                        onClick={() =>
                          window.open(`https://www.youtube.com/watch?v=${v.youtube}`, '_blank')
                        }
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    className={classNames('py-1 pr-2 pl-3 rounded-md flex gap-1 items-center', {
                      'bg-indigo-500 text-white': selected.findIndex((o) => o.id === v.id) >= 0,
                      'bg-grey-200 text-grey-900': selected.findIndex((o) => o.id === v.id) < 0,
                    })}
                    onClick={() => {
                      const tempSelected = [...selected];
                      const idx = tempSelected.findIndex((o) => o.id === v.id);
                      if (idx >= 0) tempSelected.splice(idx, 1);
                      else tempSelected.push(v);
                      setSelected(tempSelected);
                    }}
                  >
                    <div className="text-sm leading-[1.5]">列印</div>
                    <img
                      src={
                        selected.findIndex((o) => o.id === v.id) >= 0 ? IcCheckWhite : IcCheckGrey
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MathJax>
      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(count / DEFAULT_LIMIT)}
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
      <ModalCategory
        open={openCategory}
        handleClose={() => setOpenCategory(false)}
        category={categoryList}
        onSubmit={(c) => {
          setOpenCategory(false);
          resetPagination();
          navigate({ search: createSearchParams({ ...query, category: c }).toString() });
        }}
        query={query.category}
      />
      <ModalChapter
        open={openChapter}
        handleClose={() => setOpenChapter(false)}
        chapter={chapterList}
        onSubmit={(c) => {
          setOpenChapter(false);
          resetPagination();
          navigate({ search: createSearchParams({ ...query, chapter: c }).toString() });
        }}
        query={query.chapter}
      />
      <ModalTag
        open={openTag}
        handleClose={() => setOpenTag(false)}
        onSubmit={(t) => {
          setOpenTag(false);
          resetPagination();
          navigate({ search: createSearchParams({ ...query, tag: t }).toString() });
        }}
        query={query.tag}
      />
    </div>
  );
};

export default QuestionPage;
