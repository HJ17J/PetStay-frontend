import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LoginState,
  LoginPayload,
  SignupPayload,
  LoginErrorPayload,
  SignupErrorPayload,
} from "../types/authTypes";

const initialState: LoginState = {
  userid: "",
  error: {
    userid: "",
    userpw: "",
  },
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
    },
    loginFailure: (state, action: PayloadAction<LoginErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    signupSuccess: (state, action: PayloadAction<SignupPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
    },
    signupFailure: (state, action: PayloadAction<SignupErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userid = "";
      state.error = { userid: "", userpw: "" };
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
