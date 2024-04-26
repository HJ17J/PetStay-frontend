import React from "react";
import "../styles/MainPage.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />
      <section className="hero-section">
        <h1>펫스테이와 함께라면, 집을 떠나도 마음은 항상 함께합니다</h1>
        <img src="images/Main1.png" alt="mainImg1" />
      </section>

      <section className="feature-section">
        <h2>반려동물들의 최고의 친구</h2>
        <h3>펫스테이 펫시터들</h3>
        <p>사랑과 정성으로 가득 찬 돌봄, 그것이 펫스테이의 차이입니다</p>
        <img src="/images/Main2.png" alt="Main2" />
        <div className="sitter-profiles"></div>
      </section>

      <section className="vip-section">
        <p>펫스테이에서는 모든 반려동물이 VIP입니다.</p>
        <p>당신의 소중한 가족을 위한 최적의 펫시터를 찾아보세요.</p>
      </section>

      <section className="reviews-section">
        <h2>펫스테이 이용자들의 진솔한 후기</h2>
        <div className="review-list"></div>
      </section>

      <section className="custom-care-section">
        <p>당신의 일정에 맞춤 돌봄, 펫스테이가 해결해 드립니다.</p>
        <p>짧은 산책부터 장기 돌봄까지!</p>
      </section>

      <button>채팅하기</button>

      <Footer />
    </div>
  );
};

export default MainPage;
