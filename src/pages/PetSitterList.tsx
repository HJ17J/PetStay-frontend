import React from "react";
import "../styles/PetSitterList.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import type { PetSitterList } from "../types/PetSitter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DisplayStarRating } from "../components/StarRatingView";

export default function PetSitterList() {
  const [petSitters, setPetSitters] = useState<PetSitterList[]>([]);
  const [searchTarget, setSearchTarget] = useState("address");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // 펫시터 검색 요청
  const searchSitters = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/sitter?${searchTarget}=${searchKeyword}`
      );
      setPetSitters(result.data.data);
    } catch (error) {
      console.error("Failed to get searched sitter lists", error);
    }
  };

  // 펫시터 목록 조회 요청
  const fetchPetSitters = async () => {
    try {
      const result = await axios.get(process.env.REACT_APP_API_SERVER + "/sitter");
      console.log(result.data);
      setPetSitters(result.data.data);
    } catch (error) {
      console.error("Failed to fetch pet sitters:", error);
    }
  };

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
        </div>
        <section className="sitter-list-section">
          {petSitters.map((sitter) => (
            <div
              key={sitter.useridx}
              className="sitter-item"
              onClick={() => {
                navigate(`/petsitter/${sitter.useridx}`);
              }}
            >
              <div className="sitter-image-box">
                <img
                  src={sitter.img || "/placeholder.png"}
                  alt={sitter.name}
                  className="sitter-image"
                />
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
                    {sitter.animalType === "dog"
                      ? "강아지"
                      : sitter.animalType === "cat"
                      ? "고양이"
                      : "기타"}
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
