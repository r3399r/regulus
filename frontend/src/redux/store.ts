import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import apiReducer, { ApiState } from './apiSlice';
import uiReducer, { UiState } from './uiSlice';

export type RootState = {
  api: ApiState;
  ui: UiState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      api: apiReducer,
      ui: uiReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
