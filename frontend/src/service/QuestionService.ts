import fieldEndpoint from 'src/api/fieldEndpoint';
import questionEndpoint from 'src/api/questionEndpoint';
import { GetQuestionParams } from 'src/model/backend/api';
import { QuestionForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';

export const getFields = async () => {
  try {
    dispatch(startWaiting());
    const res = await fieldEndpoint.getField();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getQuestionById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const res = await questionEndpoint.getQuestion({ id: id.toLowerCase() });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getQuestionList = async (params: GetQuestionParams) => {
  try {
    dispatch(startWaiting());
    const res = await questionEndpoint.getQuestion(params);

    return { data: res.data, count: Number(res.headers['x-pagination-count']) };
  } finally {
    dispatch(finishWaiting());
  }
};

export const addNewQuestion = async (formData: QuestionForm, image?: File[]) => {
  try {
    dispatch(startWaiting());
    await questionEndpoint.postQuestion({
      content: formData.content,
      answer: formData.answer,
      category: formData.category === '' ? undefined : formData.category.split(/[ ,]+/),
      chapter: formData.chapter === '' ? undefined : formData.chapter.split(/[ ,]+/),
      tag: formData.tag === '' ? undefined : formData.tag.split(/[ ,]+/),
      youtube: formData.youtube.length > 0 ? formData.youtube : undefined,
      hasSolution: formData.hasSolution,
      image: image ? await Promise.all(image.map((v) => file2Base64(v))) : undefined,
      defaultScore: formData.defaultScore === '' ? undefined : Number(formData.defaultScore),
      defaultCount: formData.defaultCount === '' ? undefined : Number(formData.defaultCount),
    });
  } finally {
    dispatch(finishWaiting());
  }
};

export const editQuestion = async (id: string, formData: QuestionForm, image?: File[]) => {
  try {
    dispatch(startWaiting());
    await questionEndpoint.putQuestion(id.toLowerCase(), {
      content: formData.content,
      answer: formData.answer,
      category: formData.category.split(/[ ,]+/),
      chapter: formData.chapter.split(/[ ,]+/),
      tag: formData.tag === '' ? undefined : formData.tag.split(/[ ,]+/),
      youtube: formData.youtube.length > 0 ? formData.youtube : undefined,
      hasSolution: formData.hasSolution,
      image: image ? await Promise.all(image.map((v) => file2Base64(v))) : undefined,
    });
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateQuestion = async (
  id: string,
  params: {
    chapter: string[];
    category: string[];
    tag: string;
    youtube: string;
    hasSolution: boolean;
  },
) => {
  try {
    dispatch(startWaiting());
    await questionEndpoint.putQuestion(id.toLowerCase(), {
      category: params.category,
      chapter: params.chapter,
      tag: params.tag === '' ? undefined : params.tag.split(/[ ,]+/),
      youtube: params.youtube.length > 0 ? params.youtube : undefined,
      hasSolution: params.hasSolution,
    });
  } finally {
    dispatch(finishWaiting());
  }
};
