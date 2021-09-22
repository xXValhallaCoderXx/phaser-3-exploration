import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    init: (state) => {
      console.log("HEHE");
      state.socket = io("http://localhost:4000");
    },
  },
});

export const { init } = socketSlice.actions;

export default socketSlice.reducer;
