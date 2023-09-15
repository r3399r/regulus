import fieldEndpoint from 'src/api/fieldEndpoint';
import questionEndpoint from 'src/api/questionEndpoint';
import { QuestionForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

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

export const getQuestionList = async () => {
  try {
    dispatch(startWaiting());
    const res = await questionEndpoint.getQuestion();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const addNewQuestion = async (formData: QuestionForm) => {
  try {
    dispatch(startWaiting());
    await questionEndpoint.postQuestion({
      content: formData.content,
      answer: formData.answer,
      answerFormat: formData.answerFormat,
      category: formData.category.split(/[ ,]+/),
      chapter: formData.chapter.split(/[ ,]+/),
      tag: formData.tag.split(/[ ,]+/),
      youtube: formData.youtube.length > 0 ? formData.youtube : undefined,
      hasSolution: formData.hasSolution,
    });
  } finally {
    dispatch(finishWaiting());
  }
};

export const editQuestion = async (id: string, formData: QuestionForm) => {
  try {
    dispatch(startWaiting());
    await questionEndpoint.putQuestion(id.toLowerCase(), {
      content: formData.content,
      answer: formData.answer,
      answerFormat: formData.answerFormat,
      category: formData.category.split(/[ ,]+/),
      chapter: formData.chapter.split(/[ ,]+/),
      tag: formData.tag.split(/[ ,]+/),
      youtube: formData.youtube.length > 0 ? formData.youtube : undefined,
      hasSolution: formData.hasSolution,
    });
  } finally {
    dispatch(finishWaiting());
  }
};
