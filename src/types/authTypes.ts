export interface LoginState {
  userid: string;
  userpw: string;
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
  userpw: string;
  name: string;
  address: string;
  usertype: string; // 회원 유형 정보 추가
}

export interface ErrorPayload {
  userid?: string;
  userpw?: string;
  // 필요하다면 추가적인 회원가입 관련 에러 필드도 추가할 수 있습니다.
  name?: string;
  address?: string;
}
