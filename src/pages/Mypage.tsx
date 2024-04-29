// import { useState } from "react";
import { useState } from "react";
import "../styles/Mypage.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("account");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <Header />
      <div className="myPageWrapper">
        <div className="myPageContainer1">
          <div className="imageContainer">
            <img src="" alt="Profile Image" className="image profile_image" />
            <input
              type="file"
              name="profile_img"
              className="image image_input"
            />
            <div className="image_button_container">
              <button type="button">프로필 변경</button>
              <button type="button">기본 프로필</button>
            </div>
          </div>
          <div className="sectionsContainer">
            <div className="nameContainer sections">
              <div className="mypageTitle bordertopLeft">성함</div>
              <div className="inputDiv borderTopRight">
                <input type="text" />
              </div>
            </div>
            <div className="experienceContainer sections">
              <div className="mypageTitle">경력/전문분야</div>
              <div className="inputDiv">
                <input type="text" />
              </div>
            </div>
            <div className="locationContainer sections">
              <div className="mypageTitle">방문위치</div>
              <div className="inputDiv">
                <input type="text" />
              </div>
            </div>
            <div className="introductionContainer sections">
              <div className="textAreaTitle  borderBottomLeft">자가소개</div>
              <div className="textAreaDiv borderBottomRight">
                <textarea className="textAreaContainer"></textarea>
              </div>
            </div>
          </div>
          <div className="myPageBtnContainer">
            <button className="myPageUpdateBtn">수정</button>
          </div>
        </div>
        <div className="myPageContainer2">
          <div className="reservationTable1">
            <div className="table">
              <div className="row tableHeader">
                <div className="cell">No.</div>
                <div className="cell">성함</div>
                <div className="cell">날짜</div>
                <div className="cell">제목</div>
                <div className="cell">button</div>
              </div>
              <div className="row">
                <div className="cell">John</div>
                <div className="cell">Doe</div>
                <div className="cell">24</div>
                <div className="cell">KOREA</div>
                <div className="cell">
                  <button>삭제</button>
                </div>
              </div>
              <div className="row">
                <div className="cell">John</div>
                <div className="cell">Doe</div>
                <div className="cell">24</div>
                <div className="cell">KOREA</div>
                <div className="cell">
                  <button>삭제</button>
                </div>
              </div>
              <div className="row">
                <div className="cell">John</div>
                <div className="cell">Doe</div>
                <div className="cell">24</div>
                <div className="cell">KOREA</div>
                <div className="cell">
                  <button>삭제</button>
                </div>
              </div>
            </div>
          </div>
          <div className="reservationTable2"></div>
        </div>
      </div>

      <Footer />
    </>
  );
}
