"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeMap[size]} animate-spin rounded-full border-teal-200 border-t-teal-600`}
      role="status"
      aria-label="Loading"
    />
  );
}
