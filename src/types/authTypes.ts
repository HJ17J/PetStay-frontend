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
  usertype: string; // 회원 유형 정보 추가
}

export interface LoginErrorPayload {
  userid?: string; // 로그인 시 아이디 입력 에러
  userpw?: string; // 로그인 시 비밀번호 입력 에러
}

export interface SignupErrorPayload {
  userid?: string; // 회원가입 시 아이디 입력 에러
  userpw?: string; // 회원가입 시 비밀번호 입력 에러
  name?: string; // 회원가입 시 이름 입력 에러
  address?: string; // 회원가입 시 주소 입력 에러
  usertype?: string; // 회원가입 시 회원 유형 선택 에러
  message?: string;
  // 필요에 따라 추가적인 에러 필드를 여기에 포함시킬 수 있습니다.
}

export enum UserType {
  SITTER = "sitter",
  USER = "user",
  ADMIN = "admin",
}
