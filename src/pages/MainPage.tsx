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
          {/* <p className="overlay-text">
            펫스테이와 함께라면, 집을 떠나도 마음은 항상 함께합니다.
          </p> */}
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
      {/* <section className="team">
        <h3>{t("mainPage.teamTitle")}</h3>
        <div className="team-members">
          <div className="team-member">
            <img src="" alt="Team Member 1" />
            <p>{t("teamMember.name.jinHyunJung")}</p>
            <p>CEO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 2" />
            <p>{t("teamMember.name.shinDongWon")}</p>
            <p>CTO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 3" />
            <p>{t("teamMember.name.leeHyungSeok")}</p>
            <p>COO</p>
          </div>
          <div className="team-member">
            <img src="images/lim.png" alt="Team Member 4" />
            <p>{t("teamMember.name.limHakMin")}</p>
            <p>CMO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 5" />
            <p>{t("teamMember.name.hongJuHee")}</p>
            <p>CFO</p>
          </div>
        </div>
      </section> */}
      <Footer />
    </div>
  );
};

export default MainPage;
