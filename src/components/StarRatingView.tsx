import "../styles/StarRating.scss";

interface StarRatingProps {
  rating: number;
  size: "middle" | "small";
}

export function DisplayStarRating({ rating, size }: StarRatingProps) {
  return (
    <div className={`star-rating-box ${size}`}>
      <div className="stars">
        <span className="base-star">★★★★★</span>
        <span className="filled-star" style={{ width: `${rating * 20}%` }}>
          ★★★★★
        </span>
      </div>
    </div>
  );
}

export function InsertStarRating() {}
