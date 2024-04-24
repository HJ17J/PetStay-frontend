import { Link } from "react-router-dom";
import "../styles/Header.scss";

export default function Header() {
  return (
    <div className="headerContainer">
      <div className="logoTitle">
        <img src="/images/PetStayLogo.png" alt="logo" />
        petStay
      </div>
      <div className="myLinkContainer">
        <Link to="/pet-sitters" className="myLink">
          펫시터
        </Link>
        <Link to="" className="myLink">
          마이페이지
        </Link>
        <Link to="" className="myLink">
          로그인
        </Link>
        <div className="langContainer">
          <div className="en">EN</div>/<div className="cn">CN</div>/
          <div className="ko">KO</div>
        </div>
      </div>
    </div>
  );
}
