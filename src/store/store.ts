import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import petSitterReducer from "../store/PetSitterSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    petSitter: petSitterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
