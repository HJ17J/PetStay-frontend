import "boxicons/";
import "../styles/Reservation.scss";
import "../styles/ModalChat.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyCalendar from "../components/MyCalender";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useParams } from "react-router-dom";
import { review } from "../types/review";
import type { PetSitterDetail } from "../types/PetSitter";
import { ChatList, Chats, Room } from "../types/chat";
import { io } from "socket.io-client";
import axios from "axios";
import { useState, SyntheticEvent, ChangeEvent, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import { DisplayStarRating } from "../components/StarRatingView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const socket = io(process.env.REACT_APP_SOCKET_SERVER!, { autoConnect: false });
export default function Reservation() {
  const initSocketConnect = () => {
    if (!socket.connected) socket.connect();
  };

  const scrollDiv = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sitterData, setSitterData] = useState<PetSitterDetail>();
  const [reviewData, setReviewData] = useState<review[] | null>(null);

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewImage, setReviewImage] = useState("");
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPage, setTotalReviewPage] = useState(0);

  //이전 채팅 데이터 관리
  const [chatData, setChatData] = useState<Chats[] | null>(null);
  //실시간 채팅 데이터 관리
  const [chatList, setChatList] = useState<ChatList[]>([]);
  //roomidx관리
  const [roomidx, setRoomidx] = useState<number>(0);
  //현재 채팅 room관리
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  //rooms관리
  const [roomList, setRoomList] = useState<Room[] | null>(null);
  //이름관리
  const [userName, setUserName] = useState<string>("");
  const [sitterName, setSitterName] = useState<string>("");
  //채팅 상대 id관리
  const { useridx } = useParams();
  const [otheridx, setOtheridx] = useState(useridx);

  //sitter정보 받아오는 함수
  const getSitterData = async () => {
    try {
      const infoData = await axios.get(process.env.REACT_APP_API_SERVER + `/sitter/${useridx}`);
      const rvData = await axios.get(
        process.env.REACT_APP_API_SERVER + `/sitter/review/${useridx}?rvPage=${reviewPage}`
      );
      if (infoData.data.sitterInfo.length === 0) {
        alert("데이터를 불러올 수 없습니다.");
        return;
      }
      setSitterData(infoData.data.sitterInfo);
      setReviewData(rvData?.data.reviews);
      setTotalReviewPage(rvData?.data.totalPage);
      setReviewPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching sitter data:", error);
      throw error;
    }
  };

  // 리뷰 더 받아오기
  const getMoreReview = async () => {
    try {
      const reviewData = await axios.get(
        process.env.REACT_APP_API_SERVER + `/sitter/review/${useridx}?rvPage=${reviewPage}`
      );
      setReviewData((prev) => {
        if (prev === null) {
          return reviewData.data.reviews;
        } else {
          return [...prev, ...reviewData.data.reviews];
        }
      });
      setReviewPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 날짜 변환
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  // 리뷰 이미지 클릭
  const openReviewImg = (imgUrl: string) => {
    setOpenReviewModal((prev) => !prev);
    setReviewImage(imgUrl);
  };

  const addChatList = useCallback(
    (data: ChatList) => {
      let newChatList;
      if (data.img === "") {
        //텍스트 데이터 일 때
        newChatList = [
          ...chatList,
          {
            nickname: data.nickname,
            message: data.message,
            img: "",
          },
        ];
      } else {
        //img데이터 일 때
        newChatList = [
          ...chatList,
          {
            nickname: data.nickname,
            message: "",
            img: data.img,
          },
        ];
      }
      setChatList(newChatList);
    },
    [chatList]
  );

  //useEffect로 mount시 실행
  useEffect(() => {
    getSitterData();
    initSocketConnect();
  }, []);

  //실시간 채팅 진행 시 실행
  useEffect(() => {
    socket.on("message", addChatList);
    socket.on("img", addChatList);
    scrollDiv.current?.scrollIntoView({ behavior: "auto" }); //smooth
  }, [addChatList]);

  // This function will be triggered when the file field changes
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const toggleModal = async (e: SyntheticEvent) => {
    e.preventDefault();

    // axios-chat
    const chatData = await axios.get(process.env.REACT_APP_API_SERVER + `/chat/${useridx}`);
    const { chats, msg, rooms, user, sitter, roomidx } = chatData.data;
    if (user.usertype === "sitter") {
      return alert("일반회원만 이용이 가능한 서비스 입니다");
    }
    if (chats) {
      //채팅 있으면
      setChatData(chats);
    }
    setUserName(user.name);
    setSitterName(sitter.name);
    setRoomidx(roomidx);
    setRoomList(rooms);
    const nowRoom = rooms.filter((room: Room) => room.roomidx === roomidx);
    setActiveRoom(nowRoom[0]);

    const roomName = `${userName}+${sitterName}`;
    // room생성
    socket.emit("createRoom", roomName);

    if (roomList) {
      setShowModal(!showModal);
    }
  };
  const toggleImageModal = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowImageModal(!showImageModal);
  };

  const toggleEmoji = (e: SyntheticEvent) => {
    e.preventDefault();
    setPickerVisible(!isPickerVisible);
  };

  const sendMessage = async (e: SyntheticEvent) => {
    // alert("메시지 보냄!");
    e.preventDefault();
    //inputValue 전송
    //1. socket으로 전송
    if (inputValue.trim() === "") return setInputValue("");

    const sendData = {
      msg: inputValue,
      myNick: userName,
    };
    socket.emit("send", sendData);
    setInputValue("");
    //2. db에 저장
    await axios.post(process.env.REACT_APP_API_SERVER + "/insertChat", {
      content: inputValue,
      roomidx: roomidx,
    });
  };

  //이미지전송
  const sendImg = async (e: SyntheticEvent) => {
    // alert("이미지 보냄!");
    e.preventDefault();
    const formData = new FormData();
    if (selectedImage) {
      formData.append("chatFile", selectedImage);
    }
    formData.append("roomidx", String(roomidx));

    const imgResponse = await axios.post(process.env.REACT_APP_API_SERVER + "/insertImg", formData);

    const imgSrc = imgResponse.data.saveChat.img;
    //socket전송
    const sendData = {
      img: imgSrc,
      myNick: userName,
    };
    socket.emit("image", sendData);

    setSelectedImage(null);
  };

  //room클릭시
  const clickRoom = async (clickroomidx: number) => {
    //room이 생기면 실시간 채팅 데이터를 초기화
    setChatList([]);
    let otherName;
    roomList?.forEach((room) => {
      if (room.roomidx === clickroomidx) {
        otherName = room.User.name;
      }
    });

    const roomName = `${userName}+${otherName}`;
    // room생성
    socket.emit("createRoom", roomName);
    //1. 클릭한 roomidx로 검색한 채팅 데이터 가져옴
    // axios-chat
    const chatData = await axios.get(
      process.env.REACT_APP_API_SERVER + `/chatRoom/${clickroomidx}`
    );

    const { chats, msg, user, sitter, roomidx } = chatData.data;

    setChatData(chats);
    setUserName(user.name);
    setSitterName(sitter.name);
    setRoomidx(roomidx);
    let newOtheridx;
    roomList?.forEach((room) => {
      if (room.roomidx === clickroomidx) {
        newOtheridx = room.sitteridx;
        setActiveRoom(room);
      }
    });
    setOtheridx(newOtheridx);
  };

  // 번역
  const { t } = useTranslation();

  // 로그인 확인
  const isLoogedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isLoogedIn) {
      toggleModal(e);
    } else {
      alert(t("header.loginRequired"));
    }
  };

  const enterEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter") {
      // Enter 키 입력 시 실행할 내용
      sendMessage(e);
    }
  };
  const closeModal = (e: SyntheticEvent) => {
    setShowModal(!showModal);
  };
  return (
    <>
      <Header />
      <div className="reservationWrapper">
        <div className="sitter-top-section">
          <div className="sitter-title-container">
            <img src={sitterData?.img} alt="Profile Image" className="sitter-profile-img" />
            <h3 className="sitterName">{sitterData?.name}</h3>
            <p>{sitterData?.oneLineIntro}</p>
            <a href="" className="reservation-btn" onClick={handleClick}>
              문의하기
            </a>
          </div>
        </div>
        <div className="sitter-bottom-section">
          <div className="section1">
            <div className="sitter-info-container">
              <div className="info-header">
                <h3>펫시터 소개</h3>
              </div>
              <hr />

              <div className="info-container">
                <div className="info">
                  <span className="info-title">
                    <i className="bx bx-money"></i>&nbsp; 금액
                  </span>
                  <span className="infoContent">
                    {sitterData?.pay}원<span className="sixtyMins">60분</span>
                  </span>
                </div>
                <div className="info">
                  <span className="info-title">
                    <i className="bx bx-map"></i>&nbsp; 위치
                  </span>
                  <span className="infoContent">{sitterData?.address}</span>
                </div>
                <div className="info">
                  <span className="info-title">
                    <i className="bx bx-trophy"></i>&nbsp; 경력
                  </span>
                  <span className="infoContent">{sitterData?.career}</span>
                </div>
                <div className="info">
                  <span className="info-title">
                    <i className="bx bx-home"></i>&nbsp; 자격증
                  </span>
                  <span className="infoContent">{sitterData?.license}</span>
                </div>
                <div className="info self-introduction">
                  <span className="info-title">
                    <i className="bx bx-comment-dots"></i>&nbsp; 자기소개
                  </span>
                  <p className="infoContent">{sitterData?.selfIntroduction}</p>
                </div>
              </div>
            </div>
            <div className="sitter-review-container">
              <div className="review-header">
                <h3 className="review-title">리뷰</h3>
                <div className="avg-rating-box">
                  <DisplayStarRating
                    rating={sitterData?.rating ? sitterData?.rating : 0}
                    size={"middle"}
                  />
                  <span className="sitterRating">{sitterData?.rating}</span>
                  <span className="sitterReviewCount">
                    (
                    {sitterData && sitterData?.reviewCount < 999 ? sitterData?.reviewCount : "999+"}
                    )
                  </span>
                </div>
              </div>
              <hr />
              <div className="reviewContainer">
                <div className="reviewList">
                  {reviewData?.map((el) => {
                    return (
                      <div className="reviewItemContainer" key={el.reviewidx}>
                        <div className="reviewInfo">
                          <div className="reviewProfileBox">
                            <img
                              src={el.profileImg}
                              alt="profile image"
                              className="reviewerProfileImg"
                            />
                          </div>
                          <div className="reviewerName">
                            <span className="rvName">{el.name}</span>
                            <span className="rvDate">{formatDate(el.createdAt)}</span>
                          </div>
                          <div className="reviewDateBox"></div>
                          <div className="ratingBox">
                            <DisplayStarRating rating={el.rate} size={"small"} />
                            <span>{el.rate}</span>
                          </div>
                        </div>
                        <div className="hr"></div>
                        <div className="reviewContent">
                          <span>{el.content}</span>
                          {el.img && (
                            <button
                              onClick={() => {
                                openReviewImg(el.img);
                              }}
                              className="reviewThumb"
                            >
                              <img src={el.img} className="imgThumb" />
                              {!openReviewModal ? null : (
                                <div className="reviewModal">
                                  <div className="modalContent">
                                    <img className="naturalImg" src={reviewImage} />
                                  </div>
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="moreBtn"
                    style={{ display: reviewPage > totalReviewPage ? "none" : "block" }}
                    onClick={getMoreReview}
                  >
                    더보기
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="section2">
            <div>
              <MyCalendar sitteridx={sitterData?.useridx} pay={sitterData?.pay} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showModal && (
        <div id="modalbox" className="modal">
          <div className="modalCloseBtn" onClick={closeModal}>
            &times;
          </div>
          <div className="modalContainer">
            <div className="modalContent">
              <div className="modalSection1 modals">
                <div className="advertisementContainer">
                  {activeRoom && activeRoom.User && (
                    <div>
                      <img src={activeRoom.User.img} alt="" className="chattingActiveImage" />
                      <div className="chattingActiveTitle">{activeRoom.User.name}</div>
                    </div>
                  )}
                  <div className="commentsIcont">
                    <FontAwesomeIcon icon={faComments} />
                  </div>
                </div>
                <div className="chattingHistoryWrapper">
                  {roomList?.map((el) => {
                    return (
                      <div
                        onClick={() => {
                          clickRoom(el.roomidx);
                        }}
                        className="chattingContainer"
                        key={el.roomidx}
                      >
                        <div>
                          {el.User && el.User.img && (
                            <img
                              className="chattingCustomerImage"
                              src={el.User.img}
                              alt="프로필 이미지"
                            />
                          )}
                        </div>
                        <div className="chattingInformation">
                          {el.User && el.User.name && (
                            <div className="customerTitle">{el.User.name}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modalSection2 modals">
                <div className="groupChattingContainer1">
                  <div className="chatterWrapper">
                    <div className="chatterInformation">
                      {/* 기존 채팅 */}
                      {chatData &&
                        chatData.map((el) => {
                          if (el.img === null) {
                            return (
                              <div
                                key={el.chatidx}
                                className={
                                  `${el.authoridx}` === `${otheridx}` ? "otherTalk" : "meTalk"
                                }
                              >
                                <div className="chatterName">
                                  {`${el.authoridx}` === `${otheridx}` ? sitterName : userName}
                                </div>
                                <div className="chatterText">{el.content}</div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={el.chatidx}
                                className={
                                  `${el.authoridx}` === `${otheridx}` ? "otherTalk" : "meTalk"
                                }
                              >
                                <div className="chatterName">
                                  {`${el.authoridx}` === `${otheridx}` ? sitterName : userName}
                                </div>
                                <img className="chatterImg" src={el.img}></img>
                              </div>
                            );
                          }
                        })}
                      {/* 실시간 채팅 */}
                      {chatList.map((el, idx) => {
                        if (el.img === "") {
                          return (
                            <div
                              key={idx}
                              className={el.nickname === userName ? "meTalk" : "otherTalk"}
                            >
                              <div className="chatterName">{el.nickname}</div>
                              <div className="chatterText">{el.message}</div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={idx}
                              className={el.nickname === userName ? "meTalk" : "otherTalk"}
                            >
                              <div className="chatterName">{el.nickname}</div>
                              <img className="chatterImg" src={el.img}></img>
                            </div>
                          );
                        }
                      })}
                      <div ref={scrollDiv}></div>
                    </div>
                  </div>
                </div>
                <div className="chattingInputContainer2">
                  <div className="findImageContainer">
                    <label htmlFor="firstimg" className="label">
                      <i className="bx bx-plus"></i>
                    </label>
                    <input
                      type="file"
                      id="firstimg"
                      className="formControl"
                      onChange={imageChange}
                      accept="image/*"
                      name="chatFile"
                    />
                  </div>
                  <div className="sendChattingTextContainer">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={enterEvent}
                    />
                    <button onClick={sendMessage}>보내기</button>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="mt-5 mb-5"
                      style={{
                        position: "relative",
                      }}
                    >
                      {isPickerVisible && (
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
                              setInputValue(inputValue + e.native);
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
                      <div className="imageModalclose" onClick={() => setSelectedImage(null)}>
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
                        <button onClick={sendImg}>1개 전송</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
