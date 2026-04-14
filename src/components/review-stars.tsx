"use client";

interface ReviewStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

function StarIcon({
  filled,
  half,
  size,
}: {
  filled: boolean;
  half: boolean;
  size: number;
}) {
  if (half) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#halfStar)"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#F59E0B" : "none"}
      stroke={filled ? "#F59E0B" : "#CBD5E1"}
      strokeWidth="1.5"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ReviewStars({ rating, count, size = "md" }: ReviewStarsProps) {
  const px = sizeMap[size];
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<StarIcon key={i} filled half={false} size={px} />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarIcon key={i} filled={false} half size={px} />);
    } else {
      stars.push(<StarIcon key={i} filled={false} half={false} size={px} />);
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {count !== undefined && (
        <span className="ml-1.5 text-sm text-warm-500">({count})</span>
      )}
    </div>
  );
}
