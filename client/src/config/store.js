import { configureStore } from "@reduxjs/toolkit";
import authSlice from "shared/slices/auth/auth-slice";
import socketSlice from "shared/slices/socket/socket-slice";
export const store = configureStore({
  reducer: {
    counter: authSlice,
    socket: socketSlice,
  },
});

export default store;
