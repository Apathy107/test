import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  score?: number;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ score = 3.5, max = 5 }) => {
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.5;

  return (
    <div data-cmp="StarRating" style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < fullStars;
        const half = !filled && hasHalf && i === fullStars;
        return (
          <Star
            key={i}
            size={14}
            style={{
              color: filled || half ? "rgba(250, 173, 20, 1)" : "rgba(40, 48, 66, 1)",
              fill: filled ? "rgba(250, 173, 20, 1)" : "none",
            }}
          />
        );
      })}
      <span style={{ marginLeft: 4, fontSize: 12, fontWeight: 500, color: "rgba(180, 188, 204, 1)" }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
