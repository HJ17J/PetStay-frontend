import "../styles/Reservation.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "boxicons";
export default function Reservation() {
  return (
    <>
      <Header />
      <div className="reservationWrapper">
        <input type="checkbox" id="checkbox-cover" />
        <input type="checkbox" id="checkbox-page1" />
        <input type="checkbox" id="checkbox-page2" />
        <input type="checkbox" id="checkbox-page3" />
        <div className="book">
          <div className="cover">
            <label htmlFor="checkbox-cover"></label>
          </div>
          <div className="page" id="page1">
            <div className="front-page">
              <img
                src="https://picsum.photos/seed/picsum/200/300"
                alt=""
                className="frontPageImage"
              />
              <h1>Leo Yim</h1>
              <div className="social-media">
                <a href="">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="">
                  <i className="bx bxl-linkedin"></i>
                </a>
                <a href="">
                  <i className="bx bxl-instagram"></i>
                </a>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
                magni laudantium beatae quia. Recusandae, fuga quas consectetur
                perferendis aperiam esse velit veniam ducimus? Quisquam
                consequatur perferendis quidem quia, recusandae ab!
              </p>
              <div className="btn-box">
                <a href="" className="btn">
                  문의하기
                </a>
              </div>
              <span className="number-page">1</span>
              <label className="next" htmlFor="checkbox-page1">
                <i className="bx bx-chevron-right"></i>
              </label>
            </div>
            <div className="back-page">
              <div className="workeduc-box">
                <div className="workeduc-content">
                  <span className="h3">대표 경력</span>
                  <p>반련동물 훈련-관리사 교육 강사, 반려견 교육 센터 근무</p>
                </div>
                <div className="workeduc-content">
                  <span className="h3">전문 분야</span>
                  <p>행동 분석 전문, 산책 교육 전문</p>
                </div>
                <div className="workeduc-content">
                  <span className="h3">방문 지역</span>
                  <p>
                    서울특별시, 인천광역시, 경기도 전지역(그 외 지역은 출장비
                    발생)
                  </p>
                </div>
                <div className="workeduc-content">
                  <span className="h3">경력-자격</span>
                  <div className="certiContainer">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                </div>
                <div className="workeduc-content">
                  <span className="h3">이용 요금</span>
                  <p>
                    서울특별시, 인천광역시, 경기도 전지역(그 외 지역은 출장비
                    발생)
                  </p>
                </div>
              </div>
              <span className="number-page">2</span>
              <label className="prev" htmlFor="checkbox-page1">
                <i className="bx bx-chevron-left"></i>
              </label>
            </div>
          </div>
          <div className="page" id="page2">
            <div className="front-page">
              <h2>
                <span>조◯민 훈련사</span> <span>⭐5.0 184개의 리뷰</span>
              </h2>
              <div className="reviewContainer">
                <div className="reviewListContainer">
                  <div className="reviewSection">
                    <div className="info1">
                      <img src="" alt="" className="info1Img" />
                    </div>
                    <div className="info2">
                      <div className="info2Text">서◯리 님 (슈나우저·9살)</div>
                      <div className="info2Text">⭐⭐⭐⭐⭐6시간 전</div>
                    </div>
                  </div>
                  <div className="hr"></div>
                  <div className="content">
                    쉽게 이해할 수 있도록 설명해주셨어요! 알려주신 기본기부터
                    아이랑 재밌게 해보겠습니다! 어제 교육 내내 까몽이 성향때문에
                    저도 마음을 단단히 먹어야겠다고 많이 생각했네요.. 시간이 좀
                    걸리더라도 잘 배워보려고 합니다! 너무 잘 알려주셔서
                    감사했습니다 잘 해볼게요 ㅋㅋㅋ ㅎㅎ
                  </div>
                </div>
                <div className="reviewListContainer">
                  <div className="reviewSection">
                    <div className="info1">
                      <img src="" alt="" className="info1Img" />
                    </div>
                    <div className="info2">
                      <div className="info2Text">서◯리 님 (슈나우저·9살)</div>
                      <div className="info2Text">⭐⭐⭐⭐⭐6시간 전</div>
                    </div>
                  </div>
                  <div className="hr"></div>
                  <div className="content">
                    쉽게 이해할 수 있도록 설명해주셨어요! 알려주신 기본기부터
                    아이랑 재밌게 해보겠습니다! 어제 교육 내내 까몽이 성향때문에
                    저도 마음을 단단히 먹어야겠다고 많이 생각했네요.. 시간이 좀
                    걸리더라도 잘 배워보려고 합니다! 너무 잘 알려주셔서
                    감사했습니다 잘 해볼게요 ㅋㅋㅋ ㅎㅎ
                  </div>
                </div>
              </div>
              <span className="number-page">3</span>
              <label className="next" htmlFor="checkbox-page2">
                <i className="bx bx-chevron-right"></i>
              </label>
            </div>
            <div className="back-page">
              <div className="reservationContainer">
                <div className="calender"></div>
              </div>
              <span className="number-page">4</span>
              <label className="prev" htmlFor="checkbox-page2">
                <i className="bx bx-chevron-left"></i>
              </label>
            </div>
          </div>
          <div className="page" id="page3">
            <div className="front-page">
              <div className="otherReservationContainer">
                <div className="selectionContainer">
                  <div className="title">친구수를 선택해주세요</div>
                  <div className="title count_btn_container">
                    <button className="count_btn selected">친구 1명</button>
                    <button className="count_btn selected">친구 2명</button>
                    <button className="count_btn selected">친구 3명</button>
                  </div>
                </div>
                <div className="timeContainer">
                  <div className="title">시간</div>
                  <div className="btn_section1 section">
                    <button className="time_btn">09:00</button>
                    <button className="time_btn">09:30</button>
                    <button className="time_btn">10:00</button>
                    <button className="time_btn">10:30</button>
                    <button className="time_btn">11:00</button>
                    <button className="time_btn">11:30</button>
                  </div>
                  <div className="btn_section2 section">
                    <button className="time_btn">12:00</button>
                    <button className="time_btn">12:30</button>
                    <button className="time_btn">13:00</button>
                    <button className="time_btn">13:30</button>
                    <button className="time_btn">11:00</button>
                    <button className="time_btn">11:30</button>
                  </div>
                  <div className="btn_section3 section">
                    <button className="time_btn">12:00</button>
                    <button className="time_btn">12:30</button>
                    <button className="time_btn">13:00</button>
                    <button className="time_btn">13:30</button>
                    <button className="time_btn">14:00</button>
                    <button className="time_btn">14:30</button>
                  </div>
                  <div className="btn_section3 section">
                    <button className="time_btn">15:00</button>
                    <button className="time_btn">15:30</button>
                    <button className="time_btn">16:00</button>
                    <button className="time_btn">17:30</button>
                    <button className="time_btn">18:00</button>
                    <button className="time_btn">18:30</button>
                  </div>
                </div>
                <div className="leaveComment">
                  <div className="title">요청 사항</div>
                  <textarea name="" className="textarea"></textarea>
                </div>
                <div className="btnContainer">
                  <button className="event_btn reser_btn">예약</button>
                  <button className="event_btn cancel_btn">취소</button>
                </div>
              </div>
            </div>
            <span className="number-page">5</span>
          </div>
          <div className="back-cover"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
