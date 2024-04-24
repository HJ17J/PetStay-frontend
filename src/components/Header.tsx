import "../styles/Header.scss";

export default function Header() {
  return (
    <div className="headerContainer">
      <div className="logoTitle">petStay</div>
      <div className="myLinkContainer">
        <a href="" className="myLink">
          펫시터
        </a>
        <a href="" className="myLink">
          마이페이지
        </a>
        <a href="" className="myLink">
          로그인
        </a>
        <div className="langContainer">
          <div className="en">EN</div>/<div className="cn">CN</div>/
          <div className="ko">KO</div>
        </div>
      </div>
    </div>
  );
}
