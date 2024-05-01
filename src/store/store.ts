import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import petSitterReducer from "../store/PetSitterSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    petSitter: petSitterReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
