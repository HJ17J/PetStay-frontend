import React from "react";
import "../styles/MainPage.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />
      <section className="intro-section">
        <div className="image-text-overlay">
          <img
            src="images/Main1.png"
            alt="Happy Pets"
            className="faded-image"
          />
          <p className="overlay-text">
            펫스테이와 함께라면, 집을 떠나도 마음은 항상 함께합니다.
          </p>
        </div>
      </section>
      <section className="sitter-section">
        <div className="sitter-content">
          <div className="sitter-text">
            <p>반려동물들의 최고의 친구, 펫스테이 펫시터들</p>
            <p>사랑과 정성으로 가득 찬 돌봄, 그것이 펫스테이의 차이입니다.</p>
          </div>
          <div className="sitter-image">
            <img src="images/Main2.png" alt="Caring Sitter" />
          </div>
        </div>
      </section>
      <section className="vip-section">
        <p>펫스테이에서는 모든 반려동물이 VIP입니다.</p>
        <p>당신의 소중한 가족을 위한 최적의 펫시터를 찾아보세요.</p>
        <img src="images/Main3.png" alt="VIP Pets" />
      </section>
      <section className="team">
        <h3>펫스테이 팀 조직도</h3>
        <div className="team-members">
          <div className="team-member">
            <img src="" alt="Team Member 1" />
            <p>진현정</p>
            <p>CEO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 2" />
            <p>신동원</p>
            <p>CTO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 3" />
            <p>이형석</p>
            <p>COO</p>
          </div>
          <div className="team-member">
            <img src="images/lim.png" alt="Team Member 4" />
            <p>임학민</p>
            <p>CMO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 5" />
            <p>홍주희</p>
            <p>CFO</p>
          </div>
        </div>
      </section>{" "}
      <Footer />
    </div>
  );
};

export default MainPage;
