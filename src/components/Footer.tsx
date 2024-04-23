import React from "react";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>PetStay</h3>
        <p>주소: 서울 도봉구 마들로13길 61 씨드큐브 창동 7층</p>
        <p>전화번호: 02-6249-7402</p>
        <p>
          오시는 길: 창동역 1번 출구에서 나와 '씨드큐브 창동' 건물의 Gate 3로
          들어오셔서 7층 청년취업사관학교로 들어오시면 됩니다!
        </p>
        <ul className="footer-links">
          <li>
            <a href="#!">서비스 약관</a>
          </li>
          <li>
            <a href="#!">개인정보보호정책</a>
          </li>
        </ul>
      </div>
      <div className="footer-legal">
        <p>© 2024 PetStay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
