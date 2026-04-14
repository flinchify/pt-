"use client";

import { useState, useCallback } from "react";
import { PriceRangeSlider } from "./price-range-slider";

const SPECIALISATIONS = [
  "Strength Training",
  "Weight Loss",
  "HIIT",
  "Yoga",
  "Pilates",
  "Boxing",
  "CrossFit",
  "Rehabilitation",
  "Pre/Post Natal",
  "Sports Performance",
  "Bodybuilding",
  "Functional Fitness",
  "Calisthenics",
  "Martial Arts",
  "Dance Fitness",
  "Senior Fitness",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface FilterValues {
  specialisations: string[];
  location: string;
  priceRange: [number, number];
  minRating: number;
  sessionType: "all" | "in-person" | "online" | "both";
  availableDays: string[];
}

interface SearchFiltersProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onReset: () => void;
}

export const defaultFilterValues: FilterValues = {
  specialisations: [],
  location: "",
  priceRange: [30, 300],
  minRating: 0,
  sessionType: "all",
  availableDays: [],
};

export function SearchFilters({
  values,
  onChange,
  onApply,
  onReset,
}: SearchFiltersProps) {
  const [expanded, setExpanded] = useState({
    spec: true,
    location: true,
    price: true,
    rating: true,
    session: true,
    days: false,
  });

  const toggleSection = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSpec = (spec: string) => {
    const next = values.specialisations.includes(spec)
      ? values.specialisations.filter((s) => s !== spec)
      : [...values.specialisations, spec];
    onChange({ ...values, specialisations: next });
  };

  const toggleDay = (day: string) => {
    const next = values.availableDays.includes(day)
      ? values.availableDays.filter((d) => d !== day)
      : [...values.availableDays, day];
    onChange({ ...values, availableDays: next });
  };

  return (
    <aside className="space-y-5 rounded-2xl border border-warm-200 bg-white p-5">
      <h3 className="font-display text-lg font-bold text-warm-900">Filters</h3>

      {/* Specialisations */}
      <div>
        <button
          onClick={() => toggleSection("spec")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Specialisation
          <ChevronIcon open={expanded.spec} />
        </button>
        {expanded.spec && (
          <div className="mt-2 max-h-52 space-y-1.5 overflow-y-auto">
            {SPECIALISATIONS.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 text-sm text-warm-700"
              >
                <input
                  type="checkbox"
                  checked={values.specialisations.includes(s)}
                  onChange={() => toggleSpec(s)}
                  className="h-4 w-4 rounded border-warm-300 text-teal-600 focus:ring-teal-500"
                />
                {s}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-warm-100" />

      {/* Location */}
      <div>
        <button
          onClick={() => toggleSection("location")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Location
          <ChevronIcon open={expanded.location} />
        </button>
        {expanded.location && (
          <input
            type="text"
            placeholder="Suburb or postcode"
            value={values.location}
            onChange={(e) =>
              onChange({ ...values, location: e.target.value })
            }
            className="mt-2 w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400"
          />
        )}
      </div>

      <hr className="border-warm-100" />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Price Range
          <ChevronIcon open={expanded.price} />
        </button>
        {expanded.price && (
          <div className="mt-3">
            <PriceRangeSlider
              min={30}
              max={300}
              value={values.priceRange}
              onChange={(v) => onChange({ ...values, priceRange: v })}
            />
          </div>
        )}
      </div>

      <hr className="border-warm-100" />

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Minimum Rating
          <ChevronIcon open={expanded.rating} />
        </button>
        {expanded.rating && (
          <div className="mt-2 flex gap-2">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => onChange({ ...values, minRating: r })}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  values.minRating === r
                    ? "bg-teal-600 text-white"
                    : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                }`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        )}
      </div>

      <hr className="border-warm-100" />

      {/* Session Type */}
      <div>
        <button
          onClick={() => toggleSection("session")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Session Type
          <ChevronIcon open={expanded.session} />
        </button>
        {expanded.session && (
          <div className="mt-2 space-y-1.5">
            {(
              [
                ["all", "All"],
                ["in-person", "In-Person"],
                ["online", "Online"],
                ["both", "Both"],
              ] as const
            ).map(([val, label]) => (
              <label
                key={val}
                className="flex cursor-pointer items-center gap-2 text-sm text-warm-700"
              >
                <input
                  type="radio"
                  name="sessionType"
                  checked={values.sessionType === val}
                  onChange={() => onChange({ ...values, sessionType: val })}
                  className="h-4 w-4 border-warm-300 text-teal-600 focus:ring-teal-500"
                />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-warm-100" />

      {/* Availability Days */}
      <div>
        <button
          onClick={() => toggleSection("days")}
          className="flex w-full items-center justify-between text-sm font-semibold text-warm-800"
        >
          Available Days
          <ChevronIcon open={expanded.days} />
        </button>
        {expanded.days && (
          <div className="mt-2 space-y-1.5">
            {DAYS.map((d) => (
              <label
                key={d}
                className="flex cursor-pointer items-center gap-2 text-sm text-warm-700"
              >
                <input
                  type="checkbox"
                  checked={values.availableDays.includes(d)}
                  onChange={() => toggleDay(d)}
                  className="h-4 w-4 rounded border-warm-300 text-teal-600 focus:ring-teal-500"
                />
                {d}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onApply}
          className="flex-1 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-warm-200 px-4 py-2.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
