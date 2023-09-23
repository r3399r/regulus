import fieldEndpoint from 'src/api/fieldEndpoint';
import questionEndpoint from 'src/api/questionEndpoint';
import { QuestionForm } from 'src/model/Form';
import { setQuestion } from 'src/redux/apiSlice';
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

export const loadQuestionList = async () => {
  try {
    dispatch(startWaiting());
    const res = await questionEndpoint.getQuestion();

    dispatch(setQuestion(res.data));

    return res.data;
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
      answerFormat: formData.answerFormat,
      category: formData.category === '' ? undefined : formData.category.split(/[ ,]+/),
      chapter: formData.chapter === '' ? undefined : formData.chapter.split(/[ ,]+/),
      tag: formData.tag === '' ? undefined : formData.tag.split(/[ ,]+/),
      youtube: formData.youtube.length > 0 ? formData.youtube : undefined,
      hasSolution: formData.hasSolution,
      image: image ? await Promise.all(image.map((v) => file2Base64(v))) : undefined,
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
      answerFormat: formData.answerFormat,
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
