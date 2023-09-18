import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetQuestionResponse } from 'src/model/backend/api';

export type ApiState = {
  question: GetQuestionResponse | null;
};

const initialState: ApiState = {
  question: null,
};

export const uiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setQuestion: (state: ApiState, action: PayloadAction<GetQuestionResponse>) => {
      state.question = action.payload;
    },
  },
});

export const { setQuestion } = uiSlice.actions;

export default uiSlice.reducer;
