import React from "react";
import "../styles/PetSitterList.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import type { PetSitterList } from "../types/PetSitter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DisplayStarRating } from "../components/StarRatingView";
import { type } from "os";

interface AnimalType {
  dog: boolean;
  cat: boolean;
  other: boolean;
  [key: string]: boolean; // 인덱스 시그니처 추가
}

export default function PetSitterList() {
  const navigate = useNavigate();

  // 펫시터 목록
  const [petSitters, setPetSitters] = useState<PetSitterList[]>([]);
  // 펫시터 초기 목록
  const [petSittersInit, setPetSittersInit] = useState<PetSitterList[]>([]);

  // target: 검색 범위, keyword: 검색 단어
  const [searchTarget, setSearchTarget] = useState("address");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 동물
  const [animalType, setAnimalType] = useState<string[]>([]);
  // 동물 버튼 클릭 여부
  const animalTypeInit: AnimalType = { dog: false, cat: false, other: false };
  const [animalTypeBtn, setAnimalTypeBtn] = useState(animalTypeInit);

  // 펫시터 검색 요청
  const searchSitters = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/sitter/search?${searchTarget}=${searchKeyword}`
      );
      setPetSitters(result.data.data);
      setPetSittersInit(result.data.data);
    } catch (error) {
      console.error("Failed to get searched sitter lists", error);
    }
  };

  // 펫시터 목록 조회 요청
  const fetchPetSitters = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_SERVER}/sitter`);
      setPetSitters(result.data.data);
      setPetSittersInit(result.data.data);
    } catch (error) {
      console.error("Failed to fetch pet sitters:", error);
    }
  };

  // 펫시터 동물 항목 한글로 변경
  const setKoAnimalType = (type: string) => {
    if (type === "dog") {
      return "강아지";
    } else if (type === "cat") {
      return "고양이";
    } else {
      return "기타";
    }
  };

  // 펫시터 동물 항목 필터링 추가
  const filterAnimalType = (type: string) => {
    console.log(type);

    // 필터링할 데이터 추가
    if (!animalTypeBtn[type]) {
      setAnimalType((prev) => [...prev, type]);
    } else {
      setAnimalType((prev) => prev.filter((item) => item !== type));
    }
    // 버튼 css 변경
    setAnimalTypeBtn((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // 동물 항목 필터링한 데이터로 변경
  const setDataFilter = () => {
    // 필터링 전 초기값 가져옴
    setPetSitters(petSittersInit);
    // 필터링할 데이터가 없을 경우 반환
    if (animalType.length === 0) {
      return;
    }
    const filteredData = petSittersInit.filter((sitter) =>
      sitter.animalType.some((animal) => animalType.includes(animal))
    );
    console.log("필터링한 데이터", filteredData);
    setPetSitters(filteredData);
  };

  useEffect(() => {
    // console.log("동물 타입", animalType);
    // console.log("동물 버튼", animalTypeBtn);
    setDataFilter();
  }, [animalType]);

  // 금액에 쉼표 추가
  function addCommas(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    fetchPetSitters();
  }, []);

  return (
    <div>
      <Header />
      <main className="sitter-main">
        <h1>진심을 다하는 돌봄, 여러분의 반려동물을 위한 최선의 선택</h1>
        <div className="sitter-search-box">
          <select
            name="searchTarget"
            value={searchTarget}
            className="sitter-search-select"
            onChange={(e) => setSearchTarget(e.target.value)}
          >
            <option value="address">지역</option>
            <option value="name">이름</option>
          </select>
          <input
            type="search"
            placeholder="검색어를 입력하세요"
            className="sitter-search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button onClick={searchSitters} className="sitter-search-btn">
            검색
          </button>
          <div className="sitter-animal-option">
            <button
              className={`animal-btn ${animalTypeBtn.dog ? "active" : ""}`}
              onClick={() => {
                filterAnimalType("dog");
              }}
              value="dog"
            >
              강아지
            </button>
            <button
              className={`animal-btn ${animalTypeBtn.cat ? "active" : ""}`}
              onClick={() => {
                filterAnimalType("cat");
              }}
              value="cat"
            >
              고양이
            </button>
            <button
              className={`animal-btn ${animalTypeBtn.other ? "active" : ""}`}
              onClick={() => {
                filterAnimalType("other");
              }}
              value="other"
            >
              기타
            </button>
          </div>
        </div>
        <section className="sitter-list-section">
          {petSitters?.map((sitter) => (
            <div
              key={sitter.useridx}
              className="sitter-item"
              onClick={() => {
                navigate(`/petsitter/${sitter.useridx}`);
              }}
            >
              <div className="sitter-image-box">
                <img src={sitter.img} alt={sitter.name} className="sitter-image" />
              </div>
              <div className="sitter-info">
                <div className="title-box">
                  <h2>{sitter.name}</h2>
                  <DisplayStarRating rating={sitter.rating} size={"middle"} />
                  <div className="num-rating-box">
                    <span className="rating">{sitter.rating}</span>
                    <span className="rate-count">
                      ({sitter.reviewCount < 999 ? sitter.reviewCount : "999+"})
                    </span>
                  </div>
                </div>
                <div className="location">
                  <span>📍</span>
                  {sitter.address}
                </div>
                <hr />
                <div className="short-intro">
                  <p>{sitter.oneLineIntro}</p>
                </div>
                <div className="tags">
                  <div className="animalType">
                    <span className="tag-box">동물</span>
                    {sitter.animalType.map((el) => setKoAnimalType(el)).join(", ")}
                  </div>
                  <div className="price">
                    <span>
                      <span className="tag-box">1시간</span>
                      {addCommas(sitter.pay)}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
