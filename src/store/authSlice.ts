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
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false, // 로컬 스토리지 상태를 초기값으로 사용
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
      localStorage.setItem("isLoggedIn", "true"); // 로그인 상태를 로컬 스토리지에 저장
    },
    loginFailure: (state, action: PayloadAction<LoginErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    signupSuccess: (state, action: PayloadAction<SignupPayload>) => {
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.error = { userid: "", userpw: "" };
      localStorage.setItem("isLoggedIn", "true"); // 회원가입 성공 상태를 로컬 스토리지에 저장
    },
    signupFailure: (state, action: PayloadAction<SignupErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userid = "";
      state.error = { userid: "", userpw: "" };
      localStorage.removeItem("isLoggedIn"); // 로그아웃 시 로컬 스토리지에서 상태 제거
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
