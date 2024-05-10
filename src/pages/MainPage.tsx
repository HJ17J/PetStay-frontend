import React from "react";
import "../styles/MainPage.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

const MainPage = () => {
  const { t } = useTranslation();
  return (
    <div className="main-page">
      <Header />
      <section className="intro-section">
        <div className="image-text-overlay">
          <img src="images/top banner1 edit.png" alt="Happy Pets" className="faded-image" />
        </div>
      </section>
      <section className="sitter-section">
        <div className="sitter-content">
          <div className="sitter-text">
            <p>{t("mainPage.welcome")}</p>
            <p>{t("mainPage.careDifference")}</p>
          </div>
          <div className="sitter-image">
            <img src="images/Main2.png" alt="Caring Sitter" />
          </div>
        </div>
      </section>
      <section className="vip-section">
        <div className="vip-text">
          <p>{t("mainPage.everyPetVIP")}</p>
          <p>{t("mainPage.findBestSitter")}</p>
        </div>
        <div className="vip-image">
          <img src="images/Main3.png" alt="VIP Pets" />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MainPage;
