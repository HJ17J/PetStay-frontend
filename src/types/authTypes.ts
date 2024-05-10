export interface LoginState {
  userid: string;
  error: {
    userid: string;
    userpw: string;
  };
  isLoggedIn: boolean;
}

export interface LoginPayload {
  userid: string;
}

export interface SignupPayload {
  userid: string;
  name: string;
  address: string;
  usertype: string;
}

export interface LoginErrorPayload {
  userid?: string;
  userpw?: string;
}

export interface SignupErrorPayload {
  userid?: string;
  userpw?: string;
  name?: string;
  address?: string;
  usertype?: string;
  message?: string;
}

export enum UserType {
  SITTER = "sitter",
  USER = "user",
  ADMIN = "admin",
}
