import { useState } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ onChange }) => {
  const [rating, setRating] = useState(0);

  const handleClick = (index: number) => {
    setRating(index + 1);
    onChange(index + 1);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < rating ? solidStar : regularStar}
          onClick={() => handleClick(index)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
};

export default StarRating;
