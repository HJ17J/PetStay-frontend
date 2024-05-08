import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faIdBadge,
  faHome,
  faUser,
  faCertificate,
  faBriefcase,
  faComment,
  faPencilAlt,
  faPaw,
  faWonSign,
} from "@fortawesome/free-solid-svg-icons";
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
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

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
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [formToShow, setFormToShow] = useState("signIn");

  const { error } = useSelector((state: RootState) => state.auth);

  // 공통 - id 중복확인
  const checkUserIdAvailability = async () => {
    if (!userid) {
      alert(t("enterUserId"));
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/idCheck",
        { userid },
        {
          headers: { "Content-Type": "application/json" },
        }
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

  // 공통 - name 중복확인
  const checkNameAvailability = async () => {
    if (!name) {
      alert(t("enterUserName"));
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/nameCheck",
        { name },
        {
          headers: { "Content-Type": "application/json" },
        }
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

  // 공통 - 로그인
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
        alert(t("login.success"));
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
            userpw: "비밀번호가 틀렸습니다",
          })
        );
      } else {
        console.error("Login request failed:", axiosError.message);
      }
    }
  };

  // 구글 소셜 로그인
  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  };

  const handleGoogleFailure = () => {
    console.error("Login Failed");
  };

  const [initiateLogin, setInitiateLogin] = useState(false);

  useEffect(() => {
    if (initiateLogin) {
      // 로그인 시도
      // GoogleLogin 컴포넌트는 내부적으로 로그인 프로세스를 처리
      setInitiateLogin(false); // 로그인 시도 후 state 초기화
    }
  }, [initiateLogin]);

  // if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
  //   console.error("Google Client ID is undefined.");
  //   return <div>Configuration Error</div>;
  // }

  // 일반 보호자 - 회원가입
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 아이디와 닉네임 중복 확인 여부 검사
    if (userid && !isUserIdAvailable) {
      alert(t("userId.check"));
      return;
    }
    if (name && !isNameAvailable) {
      alert(t("userName.check"));
      return;
    }

    if (!userid) {
      alert(t("enterUserId"));
      return;
    }
    if (!name) {
      alert(t("enterUserName"));
      return;
    }
    if (userpw !== confirmUserpw) {
      alert(t("passwordMismatch"));
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
        alert(t("signup.success"));

        // 로그인 폼으로 전환하고 폼을 보이게 설정
        setFormToShow("signIn");
        const container = document.querySelector(".container");
        container?.classList.remove("sign-up-mode");
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

  // 펫시터 - 회원가입
  const handlePetSitterSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 아이디와 닉네임 중복 확인 여부 검사
    if (userid && !isUserIdAvailable) {
      alert(t("userId.check"));
      return;
    }
    if (name && !isNameAvailable) {
      alert(t("userName.check"));
      return;
    }

    if (!userid) {
      alert(t("enterUserId"));
      return;
    }
    if (!name) {
      alert(t("enterUserName"));
      return;
    }
    if (userpw !== confirmUserpw) {
      alert(t("passwordMismatch"));
      return;
    }
    if (animalTypes.length === 0) {
      alert(t("selectAnimalType"));
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/join`,
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
        alert(t("signup.success"));

        // 로그인 폼으로 전환하고 폼을 보이게 설정
        setFormToShow("signIn");
        const container = document.querySelector(".container");
        container?.classList.remove("sign-up-mode");
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
      alert(`회원가입 오류: ${axiosError.response?.data?.message || "자세한 정보 없음"}`);
      dispatch(
        signupFailure({
          userid: axiosError.response?.data.userid || "회원가입 오류",
          userpw: axiosError.response?.data.userpw || "회원가입 오류",
        })
      );
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ""}>
      <div className="container">
        <Header />
        <div className="forms-container">
          <div className="signin-signup">
            {formToShow === "signIn" && (
              <form className="sign-in-form" onSubmit={handleLogin}>
                <h2 className="title">{t("signIn.title")}</h2>
                <div className="input-field">
                  <FontAwesomeIcon icon={faUser} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterUserId")}
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                  />
                </div>
                {error.userid && (
                  <p style={{ color: "red", position: "relative", top: "-7px", left: "-65px" }}>
                    {error.userid}
                  </p>
                )}
                <div className="input-field">
                  <FontAwesomeIcon icon={faLock} className="icon-style" />
                  <input
                    type="password"
                    placeholder={t("enterPassword")}
                    value={userpw}
                    onChange={(e) => setUserpw(e.target.value)}
                  />
                </div>
                {error.userpw && (
                  <p style={{ color: "red", position: "relative", top: "-7px", left: "-65px" }}>
                    {error.userpw}
                  </p>
                )}
                <input type="submit" value={t("signIn.title")} className="btn solid" />
              </form>
            )}
            {formToShow === "signUp" && (
              <form className="sign-up-form" onSubmit={handleSignup}>
                <h2 className="title">{t("signUp.title")}</h2>
                <div className="input-field">
                  <FontAwesomeIcon icon={faUser} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterUserId")}
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    required
                  />
                  <button type="button" className="btn" onClick={checkUserIdAvailability}>
                    {t("check")}
                  </button>
                </div>

                <div className="input-field">
                  <FontAwesomeIcon icon={faIdBadge} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterUserName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <button type="button" className="btn" onClick={checkNameAvailability}>
                    {t("check")}
                  </button>
                </div>

                <div className="input-field">
                  <FontAwesomeIcon icon={faLock} className="icon-style" />
                  <input
                    type="password"
                    placeholder={t("enterPassword")}
                    value={userpw}
                    onChange={(e) => setUserpw(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faLock} className="icon-style" />
                  <input
                    type="password"
                    placeholder={t("confirmPassWord")}
                    value={confirmUserpw}
                    onChange={(e) => setConfirmUserpw(e.target.value)}
                    required
                  />
                </div>

                <div className="input-field">
                  <FontAwesomeIcon icon={faHome} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterAddress")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="button-container">
                  <button type="button" className="btn" onClick={showSignUpForm}>
                    {t("userSignUp")}
                  </button>
                  <button type="button" className="btn" onClick={showPetSitterForm}>
                    {t("petSitterSignUp")}
                  </button>
                </div>
                <input type="submit" className="btn" value={t("signUp.title")} />
              </form>
            )}
            {formToShow === "petSitter" && (
              <form className="petsitter-form" onSubmit={handlePetSitterSignup}>
                <h2 className="title">{t("signUp.title")}</h2>
                <div className="input-field">
                  <FontAwesomeIcon icon={faUser} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterUserId")}
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    required
                  />
                  <button type="button" className="btn" onClick={checkUserIdAvailability}>
                    {t("check")}
                  </button>
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faIdBadge} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterUserName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <button type="button" className="btn" onClick={checkNameAvailability}>
                    {t("check")}
                  </button>
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faLock} className="icon-style" />
                  <input
                    type="password"
                    placeholder={t("enterPassword")}
                    value={userpw}
                    onChange={(e) => setUserpw(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faLock} className="icon-style" />
                  <input
                    type="password"
                    placeholder={t("confirmPassWord")}
                    value={confirmUserpw}
                    onChange={(e) => setConfirmUserpw(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faHome} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("enterAddress")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faPaw} className="icon-style" />
                  <span>{t("type")}</span>&nbsp;&nbsp;
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="dog"
                      onChange={handleAnimalTypeChange}
                    />
                    {t("puppy")}
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="cat"
                      onChange={handleAnimalTypeChange}
                    />
                    {t("cat")}
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="other"
                      onChange={handleAnimalTypeChange}
                    />
                    {t("etc")}
                  </label>
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faCertificate} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("license")}
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faBriefcase} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("career")}
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faComment} className="icon-style" />
                  <input
                    type="text"
                    placeholder={t("oneLineIntro")}
                    value={oneLineIntro}
                    onChange={(e) => setOneLineIntro(e.target.value)}
                  />
                </div>
                <div className="input-field-selfIntro">
                  <FontAwesomeIcon icon={faPencilAlt} className="icon-style" />
                  <textarea
                    placeholder={t("selfIntroduction")}
                    value={selfIntroduction}
                    onChange={(e) => setSelfIntroduction(e.target.value)}
                    required
                    cols={300}
                    rows={10}
                  ></textarea>
                </div>
                <div className="input-field">
                  <FontAwesomeIcon icon={faWonSign} className="icon-style" />
                  <input
                    type="number"
                    placeholder={t("pay")}
                    value={pay}
                    onChange={(e) => setPay(e.target.value)}
                    required
                    step="1000"
                  />
                </div>
                <div className="button-container">
                  <button type="button" className="btn" onClick={showSignUpForm}>
                    {t("userSignUp")}
                  </button>
                  <button type="button" className="btn" onClick={showPetSitterForm}>
                    {t("petSitterSignUp")}
                  </button>
                </div>
                <input type="submit" className="btn" value={t("signUp.title")} />
              </form>
            )}
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>{t("newHere")}</h3>
              <br />
              <p>
                {t("newHere.description.one")}
                <br />
                <br />
                {t("newHere.description.two")}
                <br />
                <br />
                {t("newHere.description.three")}
              </p>
              <br />
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpMode}>
                {t("signUp.title")}
              </button>
            </div>
            <img src="/register/images/login.svg" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>{t("alreadyMember")}</h3>
              <br />
              <p>
                {t("welcomeBack.one")}
                <br />
                <br />
                {t("welcomeBack.two")}
                <br />
                <br />
                {t("welcomeBack.three")}
              </p>
              <br />
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={() => {
                  const container = document.querySelector(".container");
                  container?.classList.remove("sign-up-mode");
                  setFormToShow("signIn");
                }}
              >
                {t("signIn.title")}
              </button>
            </div>
            <img src="/register/images/reg.svg" className="image" alt="" />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
