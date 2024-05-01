import "../styles/Reservation.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "boxicons/";
import { useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { PetSitter } from "../types/PetSitterList";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Reservation() {
  const { sitteridx } = useParams();
  // console.log("sitteridx>>", sitteridx);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sitterData, setSitterData] = useState<PetSitter | null>(null);

  //sitter정보 받아오는 함수
  const getSitterData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER + `/sitter/${sitteridx}`
        // process.env.REACT_APP_API_SERVER + `/sitter/3`
      );
      console.log(response.data.sitterInfo);
      setSitterData(response.data.sitterInfo);
      console.log("sitterData>>>", sitterData);
    } catch (error) {
      console.error("Error fetching sitter data:", error);
      throw error;
    }
  };

  //useEffect로 mount시 실행
  useEffect(() => {
    getSitterData();
  }, []);

  // This function will be triggered when the file field changes
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // const onSubmit = (e: SyntheticEvent) => {
  //   e.preventDefault();
  //   if (selectedImage) {
  //     alert(URL.createObjectURL(selectedImage));
  //   } else {
  //     alert("No image selected!");
  //   }
  // };

  const toggleModal = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowModal(!showModal);
  };
  const toggleImageModal = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowImageModal(!showImageModal);
  };

  const toggleEmoji = (e: SyntheticEvent) => {
    e.preventDefault();
    setPickerVisible(!isPickerVisible);
  };

  return (
    <>
      <Header />
      <div className="reservationWrapper">
        <div className="reservationSection1">
          <div className="trainerInfoContainer1">
            <div className="imageContainer">
              <img
                src="https://picsum.photos/200/300?grayscale"
                alt="Profile Image"
                className="image profile_image"
              />
              <input
                type="file"
                name="profile_img"
                className="image image_input"
              />
              <div className="image_button_container">
                <div className="trainerName">둘리훈련사</div>
              </div>
            </div>
            <div className="trainerIntroductionContainer">
              {/* <div className="trainerTitle">
                <span>자기소개</span>
              </div> */}
              <div className="selfIntroductionText">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
                magni laudantium beatae quia. Recusandae, fuga quas consectetur
                perferendis aperiam esse velit veniam ducimus? Quisquam
                consequatur perferendis quidem quia, recusandae ab!
              </div>
            </div>
            <div className="btn-box">
              <a
                href=""
                className="btn"
                onClick={(e) => {
                  toggleModal(e);
                }}
              >
                문의하기
              </a>
            </div>
          </div>
          <div className="trainerInfoContainer2">
            <div className="mainExperienceContainer containers">
              <div className="trainerTitle">
                <i className="bx bx-trophy"></i>
                <span>대표경력</span>
              </div>
              <div className="textField">
                반련동물 훈련-관리사 교육 강사, 반려견 교육 센터 근무
              </div>
            </div>
            <div className="expertyContainer containers">
              <div className="trainerTitle">
                <i className="bx bxs-hand-right"></i>
                <span>전문분야</span>
              </div>
              <div className="textField">행동 분석 전문, 산책 교육 전문</div>
            </div>
            <div className="licenseContainer containers">
              <div className="trainerTitle">
                <i className="bx bx-home"></i>
                <span>경력·자격</span>
              </div>
              <div className="certiContainer">
                <div className="textField">
                  <img
                    src="https://picsum.photos/seed/picsum/200/300"
                    alt=""
                    style={{ width: "120px", height: "76px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="trainerInfoContainer3">
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
            </div>
          </div>
        </div>
        <div className="reservationSection2">
          <div className="trainerInfoContainer4">
            <div className="priceContainer">
              <div className="priceTitle">이용 금액</div>
              <hr />
              <div className="detailPriceWrapper">
                <div className="detailPriceContainer">
                  <div className="sixtyMins">
                    <span>60분</span>
                  </div>
                  <div>방문 교육</div>
                </div>
                <div>₩150,000</div>
              </div>
            </div>
          </div>
          <div className="trainerInfoContainer5"></div>
          <div className="trainerInfoContainer6"></div>
          <div className="trainerInfoContainer7"></div>
          <div className="trainerInfoContainer8">
            <div className="priceTitle">예약정보확인</div>
            <div className="selectedReservation"></div>
          </div>
          <div className="trainerInfoContainer9">
            <button className="reservationBtn">예약</button>
            <button className="reservationBtn">취소</button>
          </div>
        </div>
      </div>
      {/* Modal container */}
      {showModal && (
        <div id="modalbox" className="modal">
          <div className="modalcontent">
            <div className="modalContent1">
              <div className="imageModalclose" onClick={toggleModal}>
                &times;
              </div>
            </div>
            <div className="modalContent2">
              <div className="modalSection1 modals">
                <div className="searchContainer">
                  <div className="searchTitle">채팅</div>
                  <div className="searchInputIcon1 search">
                    <input type="text" />
                    <div className="searchDiv">
                      <i className="bx bx-search"></i>
                    </div>
                  </div>
                </div>
                <div className="advertisementContainer"></div>
                <div className="chattingHistoryWrapper">
                  <div className="chattingContainer">
                    <div>
                      <img
                        className="chattingCustomerImage"
                        src="https://picsum.photos/seed/picsum/200/300"
                        alt=""
                      />
                    </div>
                    <div className="chattingInformation">
                      <div className="customerTitle">홍길동</div>
                      <div>감사해요~~!</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modalSection2 modals">
                <div className="searchContainer">
                  <div className="areaIcon">
                    <i className="bx bx-left-arrow-alt"></i>
                  </div>
                  <div className="chattingName">채팅그룹</div>
                  <div className="searchInputIcon2 search">
                    <input type="text" />
                    <div className="searchDiv">
                      <i className="bx bx-search"></i>
                    </div>
                  </div>
                </div>
                {/* <div className="chattingInformation">
                    <div className="customerTitle">홍길동</div>
                    <div>감사해요~~!</div>
              </div> */}
                <div className="groupChattingContainer1">
                  <div className="chatterWrapper">
                    <div className="chatterImageContainer">
                      <img
                        className="chatterImage"
                        src="https://picsum.photos/seed/picsum/200/300"
                        alt=""
                      />
                    </div>
                    <div className="chatterInformation">
                      <div className="chatterName">홍길동</div>
                      <div className="chatterText">안녕하세요!</div>
                    </div>
                  </div>
                </div>
                <div className="chattingInputContainer2">
                  <div className="findImageContainer">
                    {/* <form onSubmit={onSubmit} className="form-inline"> */}
                    <label htmlFor="firstimg" className="label">
                      <i className="bx bx-plus"></i>
                    </label>
                    <input
                      type="file"
                      id="firstimg"
                      className="formControl"
                      onChange={imageChange}
                      accept="image/*"
                    />
                    {/* </form> */}
                  </div>
                  <div className="sendChattingTextContainer">
                    <input type="text" value={currentEmoji || ""} />
                    <button>보내기</button>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="mt-5 mb-5"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="emojiBtnContainer">
                        <div className="emojiBtn " onClick={toggleEmoji}>
                          <i className="bx bx-smile"></i>
                        </div>
                      </div>
                      {isPickerVisible && (
                        // <div className={isPickerVisible ? "d-block" : "d-none"}>
                        <div
                          className="border border-primary"
                          style={{
                            position: "absolute",
                            bottom: "40px",
                            right: "0",
                            zIndex: 1,
                          }}
                        >
                          <Picker
                            data={data}
                            previewPosition=""
                            onEmojiSelect={(e: any) => {
                              setCurrentEmoji(e.native);
                              setPickerVisible(!isPickerVisible);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {selectedImage && (
                  <div id="imageModalbox" className="imageModal">
                    <div className="imageModalContent">
                      <div
                        className="imageModalclose"
                        onClick={() => setSelectedImage(null)}
                      >
                        &times;
                      </div>
                      <div className="imageModalTitle">파일 전송</div>
                      <div className="imageModalBody">
                        <div className="imageModalContainer">
                          <div className="preview">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              className="chattingImage"
                              alt="Thumb"
                            />
                            <p className="fileName">{selectedImage.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="imageModalBtn">
                        <button>1개 전송</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
