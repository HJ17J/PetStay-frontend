import { useState } from "react";
import "../styles/Register.scss";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, signupFailure } from "../store/authSlice";
import { RootState } from "../store/store";
import axios, { AxiosError } from "axios";
import { LoginErrorResponse } from "../types/loginErrorResponse";
import { SignupPayload, ErrorPayload } from "../types/authTypes";

export default function Register() {
  const [userid, setUserid] = useState("");
  const [userpw, setUserpw] = useState("");
  const [confirmUserpw, setConfirmUserpw] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(true);
  const [isNameAvailable, setIsNameAvailable] = useState(true);

  const dispatch = useDispatch();

  const { error } = useSelector((state: RootState) => state.auth);

  const checkUserIdAvailability = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/join",
        {
          params: { userid },
        }
      );
      setIsUserIdAvailable(response.data.isAvailable);
    } catch (error) {
      console.error("Error checking user ID availability:", error);
      setIsUserIdAvailable(false);
    }
  };

  const checkNameAvailability = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/join",
        {
          params: { name },
        }
      );
      setIsNameAvailable(response.data.isAvailable);
    } catch (error) {
      console.error("Error checking name availability:", error);
      setIsNameAvailable(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본 이벤트 방지

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/login",
        {
          userid,
          userpw,
        },
        {
          headers: {
            "Content-Type": "application/json", // 헤더 설정 확인
          },
        }
      );

      if (response.data.status === "success") {
        // 성공 액션 디스패치
        console.log("로그인 성공");
        dispatch(loginSuccess({ userid }));
      } else {
        // 실패 액션 디스패치
        dispatch(
          loginFailure({
            userid: "존재하지 않는 아이디입니다.",
            userpw: "비밀번호가 틀립니다.",
          })
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<LoginErrorResponse>;
      if (axiosError.response) {
        // 오류 응답에 따라 오류 메시지 디스패치
        dispatch(
          loginFailure({
            userid: axiosError.response.data.error,
            userpw: axiosError.response.data.error,
          })
        );
      } else {
        console.error("Login request failed:", axiosError.message);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isUserIdAvailable) {
      alert("아이디가 이미 사용 중입니다.");
      return;
    }
    if (!isNameAvailable) {
      alert("닉네임이 이미 사용 중입니다.");
      return;
    }
    if (userpw !== confirmUserpw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post<SignupPayload>(
        `${process.env.REACT_APP_API_SERVER}/join`,
        {
          userid,
          userpw,
          name,
          address,
          usertype: "user",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.status === 200) {
        console.log("회원가입 성공");
        dispatch(loginSuccess({ userid }));
      } else {
        dispatch(
          signupFailure({
            userid: "회원가입 실패",
            userpw: "회원가입 실패",
          })
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorPayload>;
      dispatch(
        signupFailure({
          userid: axiosError.response?.data.userid || "회원가입 오류",
          userpw: axiosError.response?.data.userpw || "회원가입 오류",
        })
      );
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="아이디"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
              />
              {error.userid && <p style={{ color: "red" }}>{error.userid}</p>}
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="비밀번호"
                value={userpw}
                onChange={(e) => setUserpw(e.target.value)}
              />
              {error.userpw && <p style={{ color: "red" }}>{error.userpw}</p>}
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/kakaotalk_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/naver_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/google_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/apple_logo.png"
                  alt=""
                />
              </a>
            </div>
          </form>
          <form className="sign-up-form" onSubmit={handleSignup}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="아이디"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="btn"
              onClick={checkUserIdAvailability}
            >
              중복 확인
            </button>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                placeholder="닉네임"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="btn"
              onClick={checkNameAvailability}
            >
              중복 확인
            </button>

            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="비밀번호"
                value={userpw}
                onChange={(e) => setUserpw(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-confirm"></i>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmUserpw}
                onChange={(e) => setConfirmUserpw(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <i className="fas fa-address"></i>
              <input
                type="text"
                placeholder="주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/kakaotalk_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/naver_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/google_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/apple_logo.png"
                  alt=""
                />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => {
                const container = document.querySelector(".container");
                container?.classList.add("sign-up-mode");
              }}
            >
              Sign up
            </button>
          </div>
          <img src="/register/images/login.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => {
                const container = document.querySelector(".container");
                container?.classList.remove("sign-up-mode");
              }}
            >
              Sign in
            </button>
          </div>
          <img src="/register/images/reg.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
}
