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
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
      localStorage.setItem("isLoggedIn", "true");
    },
    loginFailure: (state, action: PayloadAction<LoginErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    signupSuccess: (state, action: PayloadAction<SignupPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
      localStorage.setItem("isLoggedIn", "true");
    },
    signupFailure: (state, action: PayloadAction<SignupErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userid = "";
      state.error = { userid: "", userpw: "" };
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { loginSuccess, loginFailure, signupSuccess, signupFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
