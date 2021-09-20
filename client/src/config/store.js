import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "shared/slices/auth/auth-slice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
