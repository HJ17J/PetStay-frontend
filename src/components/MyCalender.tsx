import { useRef, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MyCalender.scss";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ReservationInfo } from "../types/reservation";
import { CompletionTriggerKind } from "typescript";

interface MyCalendarProps {
  sitteridx: number | undefined;
  pay: number | undefined;
}

const MyCalendar = ({ sitteridx, pay }: MyCalendarProps) => {
  // 예약 설정
  // 시간대 상태를 관리하는 useState 훅
  const initTimeslot = [
    { time: "10:00", selected: false, booked: false },
    { time: "11:00", selected: false, booked: false },
    { time: "12:00", selected: false, booked: false },
    { time: "13:00", selected: false, booked: false },
    { time: "14:00", selected: false, booked: false },
    { time: "15:00", selected: false, booked: false },
    { time: "16:00", selected: false, booked: false },
    { time: "17:00", selected: false, booked: false },
    { time: "18:00", selected: false, booked: false },
    { time: "19:00", selected: false, booked: false },
    { time: "20:00", selected: false, booked: false },
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

  // 선택한 시간 초기화
  const resetSelectedTime = () => {
    setTimeslots((prevState) =>
      prevState.map((time) => ({
        ...time,
        selected: false,
      }))
    );
    setStartIdx(null);
    setEndIdx(null);
  };

  // 예약 시간 클릭 이벤트 핸들러 함수
  const handleTimeslotClick = (index: number) => {
    const clickedTime = timeslots[index];
    console.log("클릭!", clickedTime);
    console.log(timeslots);

    // 아직 아무것도 선택하지 않았을 경우
    if (startIdx === null) {
      setStartIdx(index);
      setTimeslots((prevState) => {
        const updatedTimeslots = [...prevState];
        updatedTimeslots[index].selected = true;
        return updatedTimeslots;
      });
    }
    // startIdx가 존재하는 경우
    else {
      // index가 startIdx보다 작거나, startIdx와 endIdx사이에 있는 경우 선택 취소
      if (startIdx >= index || (endIdx && index <= endIdx)) {
        resetSelectedTime();
        console.log("취소 후", timeslots);
      }
      // index가 startIdx보다 큰 경우
      else {
        setEndIdx(index);
        const updatedTimeslots = [...timeslots];
        // start와 end 사이에 예약된 시간이 있는 경우
        for (let i = startIdx; i <= index; i++) {
          if (timeslots[i].booked) {
            resetSelectedTime();
            return;
          }
          timeslots[i].selected = true;
        }
        setTimeslots(updatedTimeslots);
      }
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
      } else {
        setDate(value);
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
  const formatTimeToNumber = (time: string) => {
    // 두 자리 숫자로 포맷팅하여 반환
    return Number(time.replace(":00", ""));
  };

  const formatTimeToString = (time: number) => {
    return String(time).concat(":00");
  };

  // 예약 초기화
  const resetReservation = () => {
    setSelectedDate(null);
    setAnimalType("");
    setAnimalNum(0);
    resetSelectedTime();
    console.log("초기화", timeslots);
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
        // 유효성 검사
        if (!selectedDate) {
          alert("날짜를 선택해주세요.");
          return;
        }
        if (startIdx === null) {
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

        const startTime = formatTimeToNumber(timeslots.filter((el) => el.selected)[0].time);
        const endTime = formatTimeToNumber(timeslots.filter((el) => el.selected).pop()!.time) + 1;

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

  // 캘린더 날짜 클릭 시
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

      const reservationToday = result.data.reservation
        .filter((el: ReservationInfo) => el.confirm != "refused")
        .map((el: ReservationInfo) => [
          formatTimeToString(el.startTime),
          el.endTime - el.startTime === 0 ? 0 : el.endTime - el.startTime - 1,
        ]);

      // timeslot 값 초기화 후 예약된 시간 표시
      const updatedTimeslots = [...initTimeslot];
      // console.log("현재 timeslot", timeslots);
      for (const time of reservationToday) {
        console.log(time);
        const idx = updatedTimeslots.findIndex((el) => el.time === time[0]);
        for (let i = idx; i <= idx + time[1]; i++) {
          console.log(i);
          updatedTimeslots[i].booked = true;
        }
      }
      setTimeslots(updatedTimeslots);
      console.log(updatedTimeslots);
      // console.log("처리 후 timeslot", timeslots);
    } catch (error) {
      console.log(error);
    }
  };

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
          minDate={new Date()}
          formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
          value={date}
        />
      </div>
      <div className="calenderContainer2">
        {/* <div className="sliderBtnContainer">
          <button onClick={PrevhandleClick} className="sliderBtn prev">
            <i className="bx bx-chevron-left"></i>
          </button>
          <button onClick={NexthandleClick} className="sliderBtn next">
            <i className="bx bx-chevron-right"></i>
          </button>
        </div> */}
        <div className="timeList">
          {timeslots.map((timeslot, index) => (
            <button
              key={index}
              className={`times ${
                timeslot.selected === true
                  ? "active"
                  : timeslot.selected === false
                  ? "inactive"
                  : "disabled"
              }`}
              disabled={timeslot.booked}
              onClick={() => handleTimeslotClick(index)}
            >
              {timeslot.time}
            </button>
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
              {timeslots.some((timeslot) => timeslot.selected) ? (
                timeslots.map((timeslot, idx) => {
                  if (timeslot.selected) {
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
