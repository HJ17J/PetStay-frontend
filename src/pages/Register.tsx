import { useState } from "react";
import "../styles/Register.scss";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, signupFailure } from "../store/authSlice";
import { RootState } from "../store/store";
import axios, { AxiosError } from "axios";
import { LoginErrorResponse } from "../types/loginErrorResponse";
import {
  SignupPayload,
  LoginErrorPayload,
  SignupErrorPayload,
  LoginPayload,
} from "../types/authTypes";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [userpw, setUserpw] = useState("");
  const [confirmUserpw, setConfirmUserpw] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [pay, setPay] = useState("");
  const [license, setLicense] = useState("");
  const [career, setCareer] = useState("");
  const [oneLineIntro, setOneLineIntro] = useState("");
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(true);
  const [isNameAvailable, setIsNameAvailable] = useState(true);

  const dispatch = useDispatch();

  const [formToShow, setFormToShow] = useState("signIn");

  const { error } = useSelector((state: RootState) => state.auth);

  const checkUserIdAvailability = async () => {
    if (!userid) {
      alert("아이디를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/idCheck",
        { userid },
        { headers: { "Content-Type": "application/json" } }
      );
      setIsUserIdAvailable(response.data.isAvailable);
      alert(response.data.message);
    } catch (error: unknown) {
      console.error("Error checking user ID availability:", error);
      if (axios.isAxiosError(error)) {
        // 이제 error는 AxiosError 타입으로, 안전하게 내부 속성에 접근 가능
        console.error("Detailed Error:", error.response?.data?.message);
        setIsUserIdAvailable(false);
        alert(`Error: ${error.response?.data?.message || "Unknown Error"}`);
      } else {
        // error가 AxiosError 타입이 아닐 경우의 처리
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const checkNameAvailability = async () => {
    if (!name) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/nameCheck",
        { name },
        { headers: { "Content-Type": "application/json" } }
      );
      setIsNameAvailable(response.data.isAvailable);
      alert(response.data.message);
    } catch (error: unknown) {
      console.error("Error checking user ID availability:", error);
      if (axios.isAxiosError(error)) {
        // 이제 error는 AxiosError 타입으로, 안전하게 내부 속성에 접근 가능
        console.error("Detailed Error:", error.response?.data?.message);
        setIsNameAvailable(false);
        alert(`Error: ${error.response?.data?.message || "Unknown Error"}`);
      } else {
        // error가 AxiosError 타입이 아닐 경우의 처리
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본 이벤트 방지

    console.log("Login attempt:", { userid, userpw }); // 로그인 시도 로그

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

      console.log("Server response:", response.data); // 서버 응답 로그

      if (response.data.statusCode === 200) {
        // 성공 액션 디스패치
        console.log("로그인 성공");
        dispatch(loginSuccess({ userid }));
        navigate("/");
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
      console.error("Complete error response:", axiosError.response);
      if (axiosError.response) {
        // 오류 응답에 따라 오류 메시지 디스패치
        dispatch(
          loginFailure({
            userid: "아이디 확인이 필요합니다",
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
      const axiosError = error as AxiosError<SignupErrorPayload>;
      dispatch(
        signupFailure({
          userid: axiosError.response?.data.userid || "회원가입 오류",
          userpw: axiosError.response?.data.userpw || "회원가입 오류",
        })
      );
    }
  };

  const showSignInForm = () => {
    setFormToShow("signIn");
  };

  const showSignUpForm = () => {
    setFormToShow("signUp");
  };

  const showPetSitterForm = () => {
    setFormToShow("petSitter");
  };

  const handleSignUpMode = () => {
    setFormToShow("signUp"); // 폼을 signUp으로 설정

    // CSS 클래스를 동적으로 추가하여 UI 모드 변경
    const container = document.querySelector(".container");
    if (container) {
      container.classList.add("sign-up-mode");
    }
  };

  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAnimalTypes((prevTypes) => [...prevTypes, value]); // 이전 상태를 활용하여 업데이트
    } else {
      setAnimalTypes((prevTypes) => prevTypes.filter((type) => type !== value)); // 이전 상태에서 필터링
    }
  };

  const handlePetSitterSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !isUserIdAvailable ||
      !isNameAvailable ||
      userpw !== confirmUserpw ||
      animalTypes.length === 0
    ) {
      // 클라이언트 측 유효성 검사 실패
      if (!isUserIdAvailable) {
        alert("아이디가 이미 사용 중입니다.");
      }
      if (!isNameAvailable) {
        alert("닉네임이 이미 사용 중입니다.");
      }
      if (userpw !== confirmUserpw) {
        alert("비밀번호가 일치하지 않습니다.");
      }
      if (animalTypes.length === 0) {
        alert("최소 하나의 동물 종류를 선택해주세요.");
      }
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/join`, // 환경 변수로 설정된 서버 주소 확인
        {
          userid,
          userpw,
          name,
          address,
          type: animalTypes.join(", "),
          license,
          career,
          oneLineIntro,
          selfIntroduction,
          pay,
          usertype: "sitter",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        console.log("펫시터 회원가입 성공");
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
      // 서버 응답이 400 등의 오류일 경우 처리
      const axiosError = error as AxiosError<SignupErrorPayload>;
      alert(
        `회원가입 오류: ${
          axiosError.response?.data?.message || "자세한 정보 없음"
        }`
      );
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
          {formToShow === "signIn" && (
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
          )}
          {formToShow === "signUp" && (
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
                <button
                  type="button"
                  className="btn"
                  onClick={checkUserIdAvailability}
                >
                  중복 확인
                </button>
              </div>

              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  placeholder="닉네임"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn"
                  onClick={checkNameAvailability}
                >
                  중복 확인
                </button>
              </div>

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
              <button type="button" className="btn" onClick={showSignUpForm}>
                보호자 가입
              </button>
              <button type="button" className="btn" onClick={showPetSitterForm}>
                펫시터 가입
              </button>
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
          )}
          {formToShow === "petSitter" && (
            <form className="petsitter-form" onSubmit={handlePetSitterSignup}>
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
                <button
                  type="button"
                  className="btn"
                  onClick={checkUserIdAvailability}
                >
                  중복 확인
                </button>
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  placeholder="닉네임"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn"
                  onClick={checkNameAvailability}
                >
                  중복 확인
                </button>
              </div>
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
              <div className="input-field">
                <i className="fas fa-type"></i>
                <label>
                  <input
                    type="checkbox"
                    name="animalType"
                    value="dog"
                    onChange={handleAnimalTypeChange}
                  />
                  강아지
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="animalType"
                    value="cat"
                    onChange={handleAnimalTypeChange}
                  />
                  고양이
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="animalType"
                    value="other"
                    onChange={handleAnimalTypeChange}
                  />
                  기타
                </label>
              </div>
              <div className="input-field">
                <i className="fas fa-license"></i>
                <input
                  type="text"
                  placeholder="자격증"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-career"></i>
                <input
                  type="text"
                  placeholder="경력사항"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-oneLineIntro"></i>
                <input
                  type="text"
                  placeholder="한 줄 자기소개"
                  value={oneLineIntro}
                  onChange={(e) => setOneLineIntro(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-introduction"></i>
                <textarea
                  placeholder="자기소개"
                  value={selfIntroduction}
                  onChange={(e) => setSelfIntroduction(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="input-field">
                <i className="fas fa-pay"></i>
                <input
                  type="number"
                  placeholder="요금"
                  value={pay}
                  onChange={(e) => setPay(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn" onClick={showSignUpForm}>
                보호자 가입
              </button>
              <button type="button" className="btn" onClick={showPetSitterForm}>
                펫시터 가입
              </button>
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
          )}
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
              onClick={handleSignUpMode}
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
