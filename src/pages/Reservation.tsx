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

const socket = io("http://localhost:8080", { autoConnect: false });
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
      const result = await axios.get(process.env.REACT_APP_API_SERVER + `/sitter/${useridx}`);
      // console.log("data>", result);
      if (result.data.sitterInfo.length === 0) {
        alert("데이터를 불러올 수 없습니다.");
        return;
      }
      setSitterData(result.data.sitterInfo);
      setReviewData(result.data.reviews);
    } catch (error) {
      console.error("Error fetching sitter data:", error);
      throw error;
    }
  };
  const addChatList = useCallback(
    (data: ChatList) => {
      // console.log(data); //{message, nickname}
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

    console.log(chatData.data); //chats, msg, rooms
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
    // console.log("현재 room>>", nowRoom[0]);

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
    // console.log(selectedImage?.name);

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

    // console.log(imgSrc);
    setSelectedImage(null);
  };
  // console.log("room목록", roomList);

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
    // console.log(clickroomidx);
    //1. 클릭한 roomidx로 검색한 채팅 데이터 가져옴
    // axios-chat
    const chatData = await axios.get(
      process.env.REACT_APP_API_SERVER + `/chatRoom/${clickroomidx}`
    );

    // console.log(chatData.data); //chats, msg, rooms
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

    // console.log("현재 room>>", activeRoom);
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

  // console.log("otheridx", otheridx);

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
        <div className="reservationSection1">
          <div className="trainerInfoContainer1">
            <div className="imageContainer">
              <img
                src={sitterData?.img}
                alt="Profile Image"
                className="reservation_profile_image"
              />
              <div className="image_button_container">
                <div className="trainerName">{sitterData?.name}</div>
              </div>
            </div>
            <div className="trainerIntroductionContainer">
              {/* <div className="trainerTitle">
                <span>자기소개</span>
              </div> */}
              <div className="selfIntroductionText">{sitterData?.selfIntroduction}</div>
            </div>
            <div className="btn-box">
              <a href="" className="reservationBtn" onClick={handleClick}>
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
              <div className="textField">{sitterData?.career}</div>
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
                <div className="textField">{sitterData?.license}</div>
              </div>
            </div>
          </div>
          <div className="trainerInfoContainer3">
            <div className="reviewContainer">
              {reviewData?.map((el) => {
                return (
                  <div className="reviewListContainer" key={el.reviewidx}>
                    <div className="reviewSection">
                      <div className="info1">
                        <img src={el.img} alt="" className="info1Img" />
                      </div>
                      <div className="info2">
                        <div className="info2Text">{el.name}</div>
                        <div className="info2Text">
                          <DisplayStarRating rating={el.rate} size={"small"} />
                          <span>{el.rate}</span> {el.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="hr"></div>
                    <div className="content">{el.content}</div>
                  </div>
                );
              })}
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
                <div>₩ {sitterData?.pay}원</div>
              </div>
            </div>
          </div>
          <div className="trainerInfoContainer5">
            <MyCalendar sitteridx={sitterData?.useridx} pay={sitterData?.pay} />
            {/* Modal container */}
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
                      name="chatFile"
                    />
                    {/* </form> */}
                  </div>
                  <div className="sendChattingTextContainer">
                    <input
                      type="text"
                      // value={currentEmoji || ""}
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
                      {/* 이모지 변경  */}
                      {/* <div className="emojiBtnContainer">
                        <div className="emojiBtn " onClick={toggleEmoji}>
                          <i className="bx bx-smile"></i>
                        </div>
                      </div> */}
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
