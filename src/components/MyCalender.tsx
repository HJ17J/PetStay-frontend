import { useRef, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MyCalender.scss";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface MyCalendarProps {
  sitteridx: number | undefined;
  pay: number | undefined;
}

const MyCalendar = ({ sitteridx, pay }: MyCalendarProps) => {
  // 예약 설정
  // 시간대 상태를 관리하는 useState 훅
  const initTimeslot = [
    { time: "10:00", status: "inactive" },
    { time: "11:00", status: "inactive" },
    { time: "12:00", status: "inactive" },
    { time: "13:00", status: "inactive" },
    { time: "14:00", status: "inactive" },
    { time: "15:00", status: "inactive" },
    { time: "16:00", status: "inactive" },
    { time: "17:00", status: "inactive" },
    { time: "18:00", status: "inactive" },
    { time: "19:00", status: "inactive" },
    { time: "20:00", status: "inactive" },
  ];
  const [timeslots, setTimeslots] = useState(initTimeslot);
  const [startIdx, setStartIdx] = useState<null | number>(null); // 시작 시간 인덱스 상태
  const [endIdx, setEndIdx] = useState<null | number>(null); // 종료 시간 인덱스 상태

  const [date, setDate] = useState<Date | [Date, Date]>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [animalType, setAnimalType] = useState("");
  const [animalNum, setAnimalNum] = useState(0);
  const txtRef = useRef<HTMLTextAreaElement>(null);

  // 예약 시간 슬라이더
  const [translation, setTranslation] = useState(0);

  const NexthandleClick = () => {
    if (translation !== 0) {
      console.log("Next", translation >= 0);
      setTranslation(translation + 100);
    }
  };

  const PrevhandleClick = () => {
    if (translation !== -500) {
      console.log("Next", translation >= -500);
      setTranslation(translation - 100);
    }
  };

  // 예약 시간 클릭 이벤트 핸들러 함수
  const handleTimeslotClick = (index: number) => {
    // 클릭한 시간대의 상태 가져오기
    const clickedTimeslot = timeslots[index];
    console.log("클릭!", timeslots);
    // done 상태인 경우 클릭 이벤트 무시
    if (clickedTimeslot.status === "done") {
      return;
    }
    if (startIdx === null) {
      // 시작 시간을 클릭한 경우
      setStartIdx(index);
      setTimeslots((prevState) => {
        const updatedTimeslots = [...prevState];
        updatedTimeslots[index].status = "active";
        return updatedTimeslots;
      });
    } else if (endIdx === null && index >= startIdx) {
      // 종료 시간을 클릭한 경우 (시작 시간 이후의 시간대만 선택 가능)
      setEndIdx(index);
      // 시작 시간부터 종료 시간까지의 시간대를 활성화
      setTimeslots((prevState) => {
        const updatedTimeslots = [...prevState];
        for (let i = startIdx; i <= index; i++) {
          // 중간에 done 상태인 시간대가 있는 경우 활성화하지 않음
          if (updatedTimeslots[i].status === "done") {
            alert("이미 예약되어 있는 시간대입니다");
            break;
          } else {
            updatedTimeslots[i].status = "active";
          }
        }
        return updatedTimeslots;
      });
    } else {
      // 이미 선택된 시간대를 클릭한 경우, 모든 시간대 비활성화
      setTimeslots((prevState) =>
        prevState.map((slot) => ({
          ...slot,
          status: slot.status !== "done" ? "inactive" : slot.status,
        }))
      );
      setStartIdx(null);
      setEndIdx(null);
    }
  };

  const onChange = (
    value: Date | [Date, Date] | null,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (value !== null) {
      setSelectedDate(Array.isArray(value) ? null : value);
      if (Array.isArray(value)) {
        setDate([value[0], value[1]]);
        // console.log("Selected date range:", value);
      } else {
        setDate(value);
        // console.log("Selected date:", value);
      }
    }
  };

  // Date 포맷팅 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 시간 형식을 변환하는 함수
  const formatTime = (time: string) => {
    // 두 자리 숫자로 포맷팅하여 반환
    return Number(time.replace(":00", ""));
  };

  // 두 개의 시간을 비교하여 결과를 반환하는 함수
  function compareTime(time1: string, time2: string) {
    const [hour1, minute1] = time1.split(":").map(Number);
    const [hour2, minute2] = time2.split(":").map(Number);

    // 시간을 비교
    if (hour1 < hour2) {
      return -1; // time1이 time2보다 이전
    } else if (hour1 > hour2) {
      return 1; // time1이 time2보다 이후
    } else {
      // 시간이 같은 경우 분을 비교
      if (minute1 < minute2) {
        return -1; // time1이 time2보다 이전
      } else if (minute1 > minute2) {
        return 1; // time1이 time2보다 이후
      } else {
        return 0; // time1과 time2가 같음
      }
    }
  }

  // 예약 초기화
  const resetReservation = () => {
    setSelectedDate(null);
    setAnimalType("");
    setAnimalNum(0);
    setStartIdx(null);
    setEndIdx(null);
    setTimeslots(initTimeslot);
    txtRef.current && (txtRef.current.value = "");
  };

  // 예약 등록
  const makeReservation = async () => {
    if (!isLoggedIn) {
      alert(t("header.loginRequired"));
      return;
    } else {
      try {
        const isReserve = confirm("예약하시겠습니까?");
        if (!isReserve) {
          return;
        }

        const startTime = formatTime(timeslots.filter((el) => el.status === "active")[0].time);
        const endTime =
          formatTime(timeslots.filter((el) => el.status === "active").pop()!.time) + 1;
        console.log("시작시간", startTime);
        console.log("종료시간", endTime);

        // 유효성 검사
        if (!selectedDate) {
          alert("날짜를 선택해주세요.");
          return;
        }
        if (!startTime) {
          alert("시간을 선택해주세요.");
          return;
        }
        if (!animalType) {
          alert("반려동물의 종류를 선택해주세요.");
          return;
        }
        if (!animalNum) {
          alert("맡길 동물 친구의 수를 선택해주세요.");
          return;
        }

        const data = {
          date: selectedDate,
          startTime: startTime,
          endTime: endTime,
          content: txtRef.current?.value,
          type: animalType,
          animalNumber: animalNum,
        };
        console.log(data);

        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_API_SERVER}/resv/${sitteridx}`,
          data: data,
        });
        console.log(result);
        if (result.status === 200) {
          alert("예약이 완료되었습니다.");
          // 데이터 리셋
          resetReservation();
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          alert("세션이 만료되었습니다.\n다시 로그인해주세요.");
        } else {
          alert("예약을 완료하지 못했습니다.");
        }
      }
    }
  };

  // 초기화 버튼 클릭
  const clickReset = () => {
    const isReset = confirm("예약 중인 정보가 초기화됩니다.");
    if (isReset) {
      resetReservation();
    }
  };

  const getReservations = async (
    value: Date,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("시터번호", sitteridx);
    console.log("날짜??", value);
    try {
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_SERVER}/resvDate/${sitteridx}`,
        data: { date: value },
      });
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

    // const onClickDay = (value: Date) => {
    //   const newTimeslots = timeslots.map((timeslot) => {
    //     return { ...timeslot, status: "inactive" };
    //   });

    //   // timeslots 상태 업데이트
    //   setTimeslots(newTimeslots);
    //   // console.log("Selected date:", value);
    //   const date = formatDate(value);
    //   console.log(">>>>>", date);
    //   // console.log(process.env.REACT_APP_API_SERVER + "/resv/date");
    //   // axios
    //   axios
    //     .post(process.env.REACT_APP_API_SERVER + "/resvDate/4", { date: date }) //sitteridx props로 변경필수!!!!
    //     .then((response) => {
    //       console.log("Response:", response.data);
    //       const resvDate = response.data.reservation;

    //       //예약 내역에 따라 예약 state변경
    //       for (let i = 0; i < resvDate.length; i++) {
    //         const startTime = resvDate[i].startTime;
    //         const endTime = resvDate[i].endTime;

    //         // startTime과 endTime을 시간 형식으로 변환
    //         const formattedStartTime = formatTime(startTime);
    //         const formattedEndTime = formatTime(endTime);
    //         // timeslots 배열을 반복하여 해당하는 시간대를 찾고 상태를 변경
    //         setTimeslots((prevTimeslots) => {
    //           // const newTimeslots = [...prevTimeslots];
    //           return prevTimeslots.map((timeslot) => {
    //             // timeslot의 시간이 startTime과 endTime 사이에 있는지 확인
    //             if (
    //               compareTime(timeslot.time, formattedStartTime) >= 0 &&
    //               compareTime(timeslot.time, formattedEndTime) <= 0
    //             ) {
    //               return { ...timeslot, status: "done" };
    //             }
    //             return timeslot;
    //           });
    //         });
    //       }
    //       // }
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });
    // };

    // //예약 신청 함수
    // const insertResv = () => {
    //   let date;
    //   if (!selectedDate) {
    //     return alert("날짜를 선택해주세요");
    //   } else {
    //     date = formatDate(selectedDate);
    //   }
    //   //전송에 필요한 데이터 정리
    //   const type = typeRef.current?.value;
    //   const animalNumber = animalNumberRef.current?.value;
    //   const content = contentRef.current?.value;

    //   // active 상태인 요소들을 필터링
    //   const activeSlots = timeslots.filter((slot) => slot.status === "active");

    //   // active 상태인 요소들 중에서 최소값과 최대값을 찾음
    //   const startTime =
    //     activeSlots.length > 0
    //       ? Math.min(...activeSlots.map((slot) => parseInt(slot.time)))
    //       : null;
    //   const endTime =
    //     activeSlots.length > 0
    //       ? Math.max(...activeSlots.map((slot) => parseInt(slot.time)))
    //       : null;

    //   if (startTime !== null && endTime !== null) {
    //     // 최소값과 최대값 출력
    //     console.log("Min time:", startTime);
    //     console.log("Max time:", endTime);
    //     if (startTime === endTime) {
    //       alert("두 시간 이상 예약을 설정해주세요");
    //       return;
    //     } else {
    //       //axios요청 전송
    //       const data = {
    //         content,
    //         date,
    //         startTime,
    //         endTime,
    //         type,
    //         animalNumber,
    //       };

    //       axios
    //         .post(process.env.REACT_APP_API_SERVER + "/resv/4", { data }) // 주소 /resv/sitteridx로 수정필수!!!!
    //         .then((response) => {
    //           console.log(response.data);
    //         });
    //     }
    //   } else {
    //     alert("예약 시간대를 설정해주세요");
    //     return;
    //   }
    // };
  };
  // 번역
  const { t } = useTranslation();

  // 로그인 확인
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // //예약 신청 함수
  // const insertResv = () => {
  //   let date;
  //   if (!selectedDate) {
  //     return alert("날짜를 선택해주세요");
  //   } else {
  //     date = formatDate(selectedDate);
  //   }
  //   //전송에 필요한 데이터 정리
  //   const type = typeRef.current?.value;
  //   const animalNumber = animalNumberRef.current?.value;
  //   const content = contentRef.current?.value;

  //   // active 상태인 요소들을 필터링
  //   const activeSlots = timeslots.filter((slot) => slot.status === "active");

  //   // active 상태인 요소들 중에서 최소값과 최대값을 찾음
  //   const startTime =
  //     activeSlots.length > 0
  //       ? Math.min(...activeSlots.map((slot) => parseInt(slot.time)))
  //       : null;
  //   const endTime =
  //     activeSlots.length > 0
  //       ? Math.max(...activeSlots.map((slot) => parseInt(slot.time)))
  //       : null;

  //   if (startTime !== null && endTime !== null) {
  //     // 최소값과 최대값 출력
  //     console.log("Min time:", startTime);
  //     console.log("Max time:", endTime);
  //     if (startTime === endTime) {
  //       alert("두 시간 이상 예약을 설정해주세요");
  //       return;
  //     } else {
  //       //axios요청 전송
  //       const data = {
  //         content,
  //         date,
  //         startTime,
  //         endTime,
  //         type,
  //         animalNumber,
  //       };

  //       axios
  //         .post(process.env.REACT_APP_API_SERVER + "/resv/4", { data }) // 주소 /resv/sitteridx로 수정필수!!!!
  //         .then((response) => {
  //           console.log(response.data);
  //         });
  //     }
  //   } else {
  //     alert("예약 시간대를 설정해주세요");
  //     return;
  //   }
  // };
  // 번역
  const { t } = useTranslation();

  // 로그인 확인
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <div className="calenderWrapper">
      <div className="calenderContainer1">
        <h3 className="detailTitle">날짜</h3>
        <hr />
        <Calendar
          onChange={onChange as CalendarProps["onChange"]}
          onClickDay={getReservations}
          value={date}
          // onClickDay={onClickDay}
        />
      </div>
      <div className="calenderContainer2">
        <div className="sliderBtnContainer">
          <button onClick={PrevhandleClick} className="sliderBtn prev">
            <i className="bx bx-chevron-left"></i>
          </button>
          <button onClick={NexthandleClick} className="sliderBtn next">
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
        <div className="timeList">
          {timeslots.map((timeslot, index) => (
            <div
              key={index}
              className={`times ${
                timeslot.status === "active"
                  ? "active"
                  : timeslot.status === "done"
                  ? "done"
                  : "inactive"
              }`}
              style={{
                transform: `translateX(${translation}px)`,
                transition: "transform 0.5s ease", // Optional: Add transition for smooth animation
              }}
              onClick={() => handleTimeslotClick(index)}
            >
              {timeslot.time}
            </div>
          ))}
        </div>
      </div>
      <div className="calenderContainer3">
        <div className="animalTypeContainer">
          <span>종류</span>
          <select
            name="animalType"
            className="animalTypeSelect"
            value={animalType}
            defaultValue={""}
            onChange={(e) => {
              setAnimalType(e.target.value);
            }}
          >
            <option disabled value=""></option>
            <option value="dog">강아지</option>
            <option value="cat">고양이</option>
            <option value="etc">그외</option>
          </select>
        </div>
        <div className="animalNumContainer">
          <span>맡길 아이 수</span>
          <button
            className={`animalNumBtn ${animalNum === 1 ? "selected" : ""}`}
            onClick={(e) => setAnimalNum(1)}
          >
            1
          </button>
          <button
            className={`animalNumBtn ${animalNum === 2 ? "selected" : ""}`}
            onClick={(e) => setAnimalNum(2)}
          >
            2
          </button>
          <button
            className={`animalNumBtn ${animalNum === 3 ? "selected" : ""}`}
            onClick={(e) => setAnimalNum(3)}
          >
            3
          </button>
        </div>
      </div>
      <div className="calenderContainer4">
        <h3 className="detailTitle">추가 요청사항</h3>
        <hr />
        <textarea
          name="content"
          className="resvContent"
          cols={30}
          rows={10}
          ref={txtRef}
        ></textarea>
      </div>
      <div className="calenderContainer5">
        <div className="reservationDetail">
          <h3 className="detailTitle">예약 정보 확인</h3>
          <hr />
          <div>
            <span className="optionDetail">예약 날짜 </span>
            <span>{selectedDate ? selectedDate && formatDate(selectedDate) : "-"}</span>
          </div>
          <div>
            <span className="optionDetail">예약 시간 </span>
            <span>
              {timeslots.some((timeslot) => timeslot.status === "active") ? (
                timeslots.map((timeslot, idx) => {
                  if (timeslot.status === "active") {
                    return <span key={idx}>{timeslot.time} </span>;
                  }
                })
              ) : (
                <span>-</span>
              )}
            </span>
          </div>
          <div>
            <span className="optionDetail">반려동물 종류 </span>
            <span>
              {animalType === "dog"
                ? "강아지"
                : animalType === "cat"
                ? "고양이"
                : animalType === "etc"
                ? "그 외"
                : "-"}
            </span>
          </div>
          <div>
            <span className="optionDetail">반려동물 수 </span>
            <span>{animalNum === 0 ? "-" : animalNum + "마리"}</span>
          </div>
          <div>
            <span className="optionDetail">총 금액 </span>
            <span>
              {pay && animalNum != 0 && startIdx != null
                ? pay * animalNum * (endIdx ? endIdx - startIdx + 1 : 1)
                : "-"}
            </span>
          </div>
        </div>
        <div className="reservationBtnContainer">
          <button className="reservationBtn" onClick={makeReservation}>
            예약
          </button>
          <button className="reservationBtn" onClick={clickReset}>
            초기화
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MyCalendar;
