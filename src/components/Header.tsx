import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Header.scss";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { RootState } from "../store/store";
import axios from "axios";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  const handleLogout = () => {
    axios.post(process.env.REACT_APP_API_SERVER + "/logout");
    dispatch(logout());
    alert(t("header.logoutSuccess"));
    i18n.changeLanguage("ko");
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
        <Link to="/profile/:userid" className="myLink">
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
