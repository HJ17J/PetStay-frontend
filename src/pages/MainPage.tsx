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
      <section className="reviews-section">
        <h3>펫스테이 이용자들의 진솔한 후기</h3>
        <div className="review">
          <p>"정말 만족스러운 서비스였어요!"</p>
          <p>- 김철수</p>
        </div>
        <div className="review">
          <p>"우리 댕댕이가 너무 행복해 보였어요!"</p>
          <p>- 이영희</p>
        </div>
        <div className="review">
          <p>"다음에도 또 이용할 거예요!"</p>
          <p>- 박민지</p>
        </div>
      </section>
      <section className="custom-care-section">
        <p>당신의 일정에 맞춤 돌봄, 펫스테이가 해결해 드립니다.</p>
        <p>짧은 산책부터 장기 돌봄까지!</p>
        <img src="path/to/your/image4.jpg" alt="Custom Care" />
      </section>
      <Footer />
    </div>
  );
};

export default MainPage;
