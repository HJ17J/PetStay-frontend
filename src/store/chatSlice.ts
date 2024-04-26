import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chats } from "../types/chat";

interface ChatState {
  messages: Chats[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<Chats>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { receiveMessage } = chatSlice.actions;

export default chatSlice.reducer;
