import { useRef, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MyCalender.scss";
import axios from "axios";

export default function MyCalendar() {
  // 예약 설정
  // 시간대 상태를 관리하는 useState 훅
  const [timeslots, setTimeslots] = useState([
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
  ]);

  const [date, setDate] = useState<Date | [Date, Date]>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 예약 시간 슬라이더
  const [translation, setTranslation] = useState(0);

  const NexthandleClick = () => {
    console.log("Next", translation + 100);
    setTranslation(translation + 100);
  };

  const PrevhandleClick = () => {
    console.log("Preview", translation - 100);
    setTranslation(translation - 100);
  };

  const [startIdx, setStartIdx] = useState<null | number>(null); // 시작 시간 인덱스 상태
  const [endIdx, setEndIdx] = useState<null | number>(null); // 종료 시간 인덱스 상태

  // 클릭 이벤트 핸들러 함수
  const handleTimeslotClick = (index: number) => {
    // 클릭한 시간대의 상태 가져오기
    const clickedTimeslot = timeslots[index];

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
            alert("이미 예약되어있는 시간대입니다");
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

  //형식변환 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // 시간 형식을 변환하는 함수
  const formatTime = (time: number) => {
    // 두 자리 숫자로 포맷팅하여 반환
    return ("0" + time).slice(-2) + ":00";
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
  //예약 신청 관련 ref
  // const typeRef = useRef<HTMLInputElement | null>(null);
  // const animalNumberRef = useRef<HTMLInputElement | null>(null);
  // const contentRef = useRef<HTMLTextAreaElement | null>(null);

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

  return (
    <div className="calenderWrapper">
      {/* <h1>Calendar</h1> */}
      <div className="calenderContainer1">
        <Calendar
          onChange={onChange as CalendarProps["onChange"]}
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
      <div className="calenderContainer3"></div>
      <div className="calenderContainer4">
        <div className="priceTitle">예약정보확인</div>
        <div className="selectedReservation">
          <div>{selectedDate && formatDate(selectedDate)}</div>
          <div>
            {timeslots.map((timeslot, index) => {
              if (timeslot.status === "active") {
                return <div key={index}>{timeslot.time}</div>;
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="reservationBtnContainer">
          <button className="reservationBtn">예약</button>
          <button className="reservationBtn">취소</button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
