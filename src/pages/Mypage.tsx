// import { useState } from "react";
import { useState, SyntheticEvent, ChangeEvent, useEffect, useCallback } from "react";
import "../styles/Mypage.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Picker from "@emoji-mart/react";
import { useParams } from "react-router-dom";
import { ChatList, Chats, Room } from "../types/chat";
import { io } from "socket.io-client";
import data from "@emoji-mart/data";
import axios from "axios";
import { UserData, Reservation } from "../types/reservation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faQuestion } from "@fortawesome/free-solid-svg-icons";
import StarRating from "../components/StarRating";

const socket = io("http://localhost:8080", { autoConnect: false });

export default function Mypage() {
  // 주희 chat
  const initSocketConnect = () => {
    if (!socket.connected) socket.connect();
  };
  const [usertype, setUsertype] = useState("");
  const [useridx, setUseridx] = useState(0);
  // =================
  const [activeTab, setActiveTab] = useState("account");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chatData, setChatData] = useState<Chats[] | null>(null);
  const [chatList, setChatList] = useState<ChatList[]>([]);
  const [roomList, setRoomList] = useState<Room[] | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [sitterName, setSitterName] = useState<string>("");
  const [roomidx, setRoomidx] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sitterData, setSitterData] = useState(null);
  const fetchUserData = async () => {
    try {
      // console.log("userid:", userid); // Log useridx to check if it's populated
      const response = await axios.post(`${process.env.REACT_APP_API_SERVER}/profile`);
      console.log("response:", response.data); // Log response to check if it's received
      setUserData(response.data);
      setReservations(response.data.resvData);

      setUsertype(response.data.userData.usertype);
      setUserName(response.data.userData.name);
      setUseridx(response.data.userData.useridx); //현재 로그인 계정의 idx
    } catch (error) {
      console.error("Error fetching sitter data:", error);
    }
  };

  const addChatList = useCallback(
    (data: ChatList) => {
      console.log(data); //{message, nickname}
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

  useEffect(() => {
    fetchUserData();
    initSocketConnect();
  }, []);
  //실시간 채팅 진행 시 실행
  useEffect(() => {
    socket.on("message", addChatList);
    socket.on("img", addChatList);
  }, [addChatList]);

  // 리뷰
  const [reviewContent, setReviewContent] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewRate, setReviewRate] = useState(0);

  const { resvidx } = useParams<{ resvidx: string }>();

  // 리뷰 등록
  const submitReview = async () => {
    if (!resvidx) return;
    const formData = new FormData();

    formData.append("content", reviewContent);
    if (reviewImage) {
      formData.append("img", reviewImage, reviewImage.name);
    }
    formData.append("rate", reviewRate.toString());

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVER}/review/${resvidx}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("리뷰가 등록되었습니다.");
      setShowReviewModal(false); // 모달 닫기
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowReviewModal(false);
  };

  const toggleEmoji = (e: SyntheticEvent) => {
    e.preventDefault();
    setPickerVisible(!isPickerVisible);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const clickRoom = async (clickroomidx: number) => {
    //room이 생기면 실시간 채팅 데이터를 초기화
    setChatList([]);
    let otherName;
    roomList?.forEach((room) => {
      if (room.roomidx === clickroomidx) {
        otherName = room.User.name;
        console.log("대화 상대이름", otherName);
        setSitterName(otherName);
      }
    });

    //if문으로 type에 따라
    let roomName;
    if (usertype === "user") {
      roomName = `${userName}+${otherName}`;
    } else if (usertype === "sitter") {
      roomName = `${otherName}+${userName}`;
    }

    console.log("roomName>>>", roomName);
    // room생성
    socket.emit("createRoom", roomName);
    // console.log(clickroomidx);
    //1. 클릭한 roomidx로 검색한 채팅 데이터 가져옴
    // axios-chat
    const chatData = await axios.get(
      process.env.REACT_APP_API_SERVER + `/chatRoom/${clickroomidx}`
    );

    console.log(chatData.data); //chats, msg, rooms
    const { chats, msg, user, sitter, roomidx } = chatData.data;

    setChatData(chats);
    // setUserName(user.name);
    // setSitterName(sitter.name);
    setRoomidx(roomidx);
  };

  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
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

  const toggleModal = async (e: SyntheticEvent) => {
    e.preventDefault();

    // axios-chat
    const chatData = await axios.get(process.env.REACT_APP_API_SERVER + "/Onechat");
    console.log("chatData", chatData.data);
    const { rooms } = chatData.data;

    setRoomList(rooms);

    if (roomList) {
      setShowModal(!showModal);
    }
  };

  const handleReviewClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowReviewModal(!showReviewModal);
  };

  // 예약 삭제
  const handleDeleteReservation = async (reservationId: number) => {
    // 사용자에게 삭제 확인 요청
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const url = `${process.env.REACT_APP_API_SERVER}/reservation/${reservationId}/delete`;
        await axios.delete(url);

        // 상태 업데이트로 UI에서 해당 예약 제거
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.resvidx !== reservationId)
        );
      } catch (error) {
        console.error("Failed to delete reservation", error);
        alert("예약 삭제에 실패했습니다.");
      }
    } else {
      // 사용자가 취소를 선택했을 때
      console.log("삭제가 취소되었습니다.");
    }
  };

  const handleStarChange = (rating: number) => {
    setReviewRate(rating);
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
            {sitterData ? (
              <div className="nameContainer sections">
                <div className="mypageTitle bordertopLeft">성함</div>
                <div className="inputDiv borderTopRight">
                  <input type="text" value={sitterData} />
                </div>
              </div>
            ) : (
              ""
            )}

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
            <button className="myPageUpdateBtn" onClick={toggleModal}>
              채팅창
            </button>
            <button className="myPageUpdateBtn">수정</button>
          </div>
        </div>
        <div className="myPageContainer2">
          <div className="reservationTable1">
            <div className="table">
              <div className="row tableHeader">
                <div className="cell">No.</div>
                <div className="cell">펫시터</div>
                <div className="cell">날짜</div>
                <div className="cell">요금</div>
                <div className="cell">삭제</div>
                <div className="cell">예약 상태</div>
              </div>
              {reservations
                .filter((reservation) => reservation.confirm !== "done")
                .map((reservation, index) => (
                  <div className="row" key={index}>
                    <div className="cell">{index + 1}</div>
                    <div className="cell">{reservation.sittername}</div>
                    <div className="cell">{reservation.date}</div>
                    <div className="cell">{reservation.price}</div>
                    <div className="cell myPagedeleteBtn">
                      <button onClick={() => handleDeleteReservation(reservation.resvidx)}>
                        삭제
                      </button>
                    </div>
                    <div className="cell">
                      {reservation.confirm === "approved" ? (
                        <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} /> // 체크 표시
                      ) : reservation.confirm === "refused" ? (
                        <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} /> // X 표시
                      ) : (
                        <FontAwesomeIcon icon={faQuestion} style={{ color: "blue" }} /> // ? 표시
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="reservationTable2">
            <div className="table">
              <div className="row tableHeader">
                <div className="cell">No.</div>
                <div className="cell">펫시터</div>
                <div className="cell">날짜</div>
                <div className="cell">요금</div>
                <div className="cell">리뷰</div>
              </div>
              {reservations
                .filter((reservation) => reservation.confirm === "done")
                .map((reservation, index) => (
                  <div className="row" key={index}>
                    <div className="cell">{index + 1}</div>
                    <div className="cell">{reservation.sittername}</div>
                    <div className="cell">{reservation.date}</div>
                    <div className="cell">{reservation.price}</div>
                    <div className="cell myPageReviewBtn">
                      <button onClick={(e) => handleReviewClick(e)}>리뷰하기</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
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
              <StarRating value={reviewRate} onChange={setReviewRate} />
              <div className="reviewtextArea">
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                ></textarea>
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
                  onChange={(e) => setReviewImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="reviewImageContainer">
                <img src="https://picsum.photos/200/300?grayscale" alt="" />
              </div>
              <div className="reviewBtn">
                <button onClick={submitReview}>등록</button>
                <button onClick={closeModal}>취소</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div id="modalbox" className="modal">
          <div className="modalCloseBtn" onClick={toggleModal}>
            &times;
          </div>
          <div className="modalContainer">
            <div className="modalContent">
              <div className="modalSection1 modals">
                {/* <div className="searchContainer">
                  <div className="searchTitle">채팅</div>
                  <div className="searchInputIcon1 search">
                    <input type="text" />
                    <div className="searchDiv">
                      <i className="bx bx-search"></i>
                    </div>
                  </div>
                </div> */}
                <div className="advertisementContainer"></div>
                <div className="chattingHistoryWrapper">
                  {/* <div className="chattingContainer">
                    <div>
                      <img className='chattingCustomerImage' src='https://picsum.photos/seed/picsum/200/300' alt='' />
                    </div>
                    <div className='chattingInformation'>
                      <div className='customerTitle'>홍길동</div>
                      <div>감사해요~~!</div>
                    </div>
                  </div> */}
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
                          <img
                            className="chattingCustomerImage"
                            src={el.User.img}
                            alt="프로필 이미지"
                          />
                        </div>
                        <div className="chattingInformation">
                          <div className="customerTitle">{el.User.name}</div>
                          {/* <div>감사해요~~!</div> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modalSection2 modals">
                {/* <div className="searchContainer">
                  <div className="areaIcon">
                    <i className="bx bx-left-arrow-alt"></i>
                  </div>
                  <div className='chattingName'>채팅그룹</div>
                  <div className='searchInputIcon2 search'>
                    <input type='text' />
                    <div className='searchDiv'>
                      <i className='bx bx-search'></i>
                    </div>
                  </div>
                </div> */}
                <div className="groupChattingContainer1">
                  <div className="chatterWrapper">
                    {/* <div className="chatterImageContainer">
                      <img
                        className="chatterImage"
                        src="https://picsum.photos/seed/picsum/200/300"
                        alt=""
                      />
                    </div> */}
                    <div className="chatterInformation">
                      {/* 기존 채팅 */}
                      {chatData &&
                        chatData.map((el) => {
                          if (el.img === null) {
                            return (
                              <div
                                key={el.chatidx}
                                className={
                                  `${el.authoridx}` === `${useridx}` ? "meTalk" : "otherTalk"
                                }
                              >
                                <div className="chatterName">
                                  {`${el.authoridx}` === `${useridx}` ? userName : sitterName}
                                </div>
                                <div className="chatterText">{el.content}</div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={el.chatidx}
                                className={
                                  `${el.authoridx}` === `${useridx}` ? "meTalk" : "otherTalk"
                                }
                              >
                                <div className="chatterName">
                                  {`${el.authoridx}` === `${useridx}` ? userName : sitterName}
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
