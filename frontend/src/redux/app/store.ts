// src/redux/app/store.ts - for storing all reducers
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import aichatReducer from "../features/aichat/aichatSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    aichat: aichatReducer

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
