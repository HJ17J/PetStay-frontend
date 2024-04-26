import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "../styles/PetSitterList.scss";
import { PetSitter } from "../types/PetSitterList";
import { RootState } from "../store/store";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PetSitterList() {
  const [petSitters, setPetSitters] = useState<PetSitter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSitters, setFilteredSitters] = useState<PetSitter[]>([]);

  const handleSearch = () => {
    const filtered = petSitters.filter((sitter) =>
      sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSitters(filtered);
  };
  const fetchPetSitters = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER + "/sitter"
      );
      setPetSitters(response.data);
    } catch (error) {
      console.error("Failed to fetch pet sitters:", error);
    }
  };

  useEffect(() => {
    fetchPetSitters();
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <nav>
          <ul className={styles.menu}>{/* 메뉴 항목들 */}</ul>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>진심을 다하는 돌봄, 여러분의 반려동물을 위한 최선의 선택</h1>
        <div className={styles.searchBox}>
          <input
            type="search"
            placeholder="검색"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>
        <section>
          {petSitters.map((sitter) => (
            <div key={sitter.id} className={styles.sitterItem}>
              <img
                src={sitter.image || "/placeholder.png"}
                alt={sitter.name}
                className={styles.sitterImage}
              />
              <div className={styles.sitterInfo}>
                <h2>{sitter.name}</h2>
                <div className={styles.rating}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      style={{ color: index < sitter.rating ? "gold" : "grey" }}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <div>{sitter.reviewsCount}</div>
                <div>{sitter.price.toLocaleString()} 원</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
