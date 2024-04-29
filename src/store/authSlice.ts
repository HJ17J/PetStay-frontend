import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginState, LoginPayload, ErrorPayload } from "../types/authTypes";

const initialState: LoginState = {
  userid: "",
  userpw: "",
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
      state.userpw = "";
      state.error = { userid: "", userpw: "" };
    },
    loginFailure: (state, action: PayloadAction<ErrorPayload>) => {
      state.error = { ...state.error, ...action.payload };
    },
    signupFailure: (state, action: PayloadAction<ErrorPayload>) => {
      // 회원가입 실패시 에러 상태 업데이트
      state.error = { ...state.error, ...action.payload };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userid = "";
      state.userpw = "";
      state.error = { userid: "", userpw: "" };
    },
  },
});

export const { loginSuccess, loginFailure, signupFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
