import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  workload: number;
  showSnackbar: boolean;
  snackbar: { message: string; severity?: 'success' | 'error' | 'warning' | 'info' };
};

const initialState: UiState = {
  workload: 0,
  showSnackbar: false,
  snackbar: { message: '' },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startWaiting: (state: UiState) => {
      state.workload = state.workload + 1;
    },
    finishWaiting: (state: UiState) => {
      state.workload = state.workload - 1;
    },
    openSnackbar: (state: UiState, action: PayloadAction<UiState['snackbar']>) => {
      state.showSnackbar = true;
      state.snackbar = action.payload;
    },
    dismissSnackbar: (state: UiState) => {
      state.showSnackbar = false;
    },
  },
});

export const { startWaiting, finishWaiting, openSnackbar, dismissSnackbar } = uiSlice.actions;

export default uiSlice.reducer;
