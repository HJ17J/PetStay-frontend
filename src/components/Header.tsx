import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Header.scss";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  // 번역 함수 디버깅
  console.log("Translated Header.petSitter:", t("header.petSitter"));
  console.log("Translated Header.myPage:", t("header.myPage"));
  console.log("Translated Header.login:", t("header.login"));

  return (
    <div className="headerContainer">
      <div className="logoTitle">
        <img src="/images/PetStayLogo.png" alt="logo" />
        petStay
      </div>
      <div className="myLinkContainer">
        <Link to="/pet-sitters" className="myLink">
          {t("header.petSitter")}
        </Link>
        <Link to="/profile/:userid" className="myLink">
          {t("header.myPage")}
        </Link>
        <Link to="/login" className="myLink">
          {t("header.login")}
        </Link>
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
