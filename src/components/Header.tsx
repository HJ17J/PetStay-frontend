import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Header.scss";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { RootState } from "../store/store";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    alert(t("header.logoutSuccess"));
    i18n.changeLanguage("ko");
  };

  const handleMyPageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isLoggedIn) {
      navigate("/profile/:userid"); // 로그인 상태면 마이페이지로 이동
    } else {
      alert(t("header.loginRequired")); // 로그인 안 했으면 알림창 띄우기
    }
  };

  return (
    <div className="headerContainer">
      <Link to="/" className="logoTitle">
        <img src="/images/PetStayLogo.png" alt="logo" />
        petStay
      </Link>
      <div className="myLinkContainer">
        <Link to="/petsitters" className="myLink">
          {t("header.petSitter")}
        </Link>
        <Link to="/profile/:userid" className="myLink" onClick={handleMyPageClick}>
          {t("header.myPage")}
        </Link>
        {isLoggedIn ? (
          <div className="myLink" onClick={handleLogout}>
            {t("header.logout")}
          </div>
        ) : (
          <Link to="/login" className="myLink">
            {t("header.login")}
          </Link>
        )}
        <div className="langContainer">
          <div className="en" onClick={() => i18n.changeLanguage("en")}>
            EN
          </div>
          /
          <div className="cn" onClick={() => i18n.changeLanguage("cn")}>
            CN
          </div>
          /
          <div className="ko" onClick={() => i18n.changeLanguage("ko")}>
            KO
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
