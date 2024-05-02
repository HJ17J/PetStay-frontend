// import { useState } from "react";
import { useState, SyntheticEvent } from "react";
import "../styles/Mypage.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("account");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleReviewClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowReviewModal(!showReviewModal);
  };

  return (
    <>
      <Header />
      <div className="myPageWrapper">
        <div className="myPageContainer1">
          <div className="imageContainer">
            <img
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Profile Image"
              className="myPage_profile_image"
            />
            {/* <input
              type="file"
              name="profile_img"
              className="myPage_image_input"
            /> */}
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
                <div className="cell">button</div>
              </div>
              <div className="row">
                <div className="cell">John</div>
                <div className="cell">Doe</div>
                <div className="cell">24</div>
                <div className="cell">KOREA</div>
                <div className="cell myPagedeleteBtn">
                  <button>삭제</button>
                </div>
                <div className="cell myPageReviewBtn">
                  <button onClick={(e) => handleReviewClick(e)}>
                    리뷰하기
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="reservationTable2"></div>
        </div>
      </div>

      <Footer />
      {showReviewModal && (
        <div id="reviewModalbox" className="reviewModal">
          <div className="reviewModalContainer">
            <div className="addReviewContainer">
              <div className="reviewCloseBtn" onClick={handleReviewClick}>
                &times;
              </div>
              <div className="reviewtitle">리뷰쓰기</div>
              <div className="reviewSubtitle">어떤 점이 좋았나요?</div>
              <div className="reviewtextArea">
                <textarea></textarea>
              </div>
              <div className="reviewAddImage">
                <label htmlFor="reviewImage" className="reviewlabel">
                  <i className="bx bxs-camera"></i>
                  <div className="reviewImageTitle">사진/동영상 첨부하기</div>
                </label>
                <input
                  type="file"
                  id="reviewImage"
                  className="reviewInput"
                  accept="image/*"
                />
              </div>
              <div className="reviewImageContainer">
                <img src="https://picsum.photos/200/300?grayscale" alt="" />
              </div>
              <div className="reviewBtn">
                <button>등록</button>
                <button>취소</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
