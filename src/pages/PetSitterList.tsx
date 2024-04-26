import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "../styles/PetSitterList.scss";
import { PetSitter } from "../types/PetSitterList";
const petSitters: PetSitter[] = [
  // 반려동물 돌보미 목록 데이터
];

export default function PetSitterList() {
  return (
    <Router>
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
            />
          </div>
          <section>
            {petSitters.map((sitter) => (
              <div key={sitter.id} className={styles.sitterItem}>
                <img
                  src="/placeholder.png"
                  alt={sitter.name}
                  className={styles.sitterImage}
                />
                <div className={styles.sitterInfo}>
                  <h2>{sitter.name}</h2>
                  <div className={styles.rating}>
                    {" "}
                    {/* 별점 처리는 이곳에서 하세요. */}{" "}
                  </div>
                  <div>{sitter.reviews} 리뷰</div>
                  <div>{sitter.price.toLocaleString()} 원</div>
                </div>
                <button className={styles.reserveButton}>예약</button>
              </div>
            ))}
          </section>
        </main>
      </div>
    </Router>
  );
}
