"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dark?: boolean;
}

interface Suggestion {
  display: string;
  suburb: string;
  state: string;
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Enter suburb or postcode",
  className = "",
  dark = false,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchSuburbs = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: `${query}, Australia`,
            format: "json",
            addressdetails: "1",
            limit: "8",
            countrycodes: "au",
          }),
        {
          headers: { "User-Agent": "AnywherePT/1.0" },
        }
      );

      if (!res.ok) return;
      const data = await res.json();

      const results: Suggestion[] = [];
      const seen = new Set<string>();

      for (const item of data) {
        const addr = item.address || {};
        const suburb =
          addr.suburb ||
          addr.town ||
          addr.city ||
          addr.village ||
          addr.hamlet ||
          addr.locality ||
          "";
        const state = addr.state || "";
        const stateShort = abbreviateState(state);

        if (!suburb) continue;
        const key = `${suburb}-${stateShort}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
          display: `${suburb}, ${stateShort}`,
          suburb,
          state: stateShort,
        });
      }

      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      // Silently fail
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchSuburbs(val), 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.suburb);
    setShowSuggestions(false);
  };

  const handleGeolocate = async () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
              new URLSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                format: "json",
                addressdetails: "1",
              }),
            {
              headers: { "User-Agent": "AnywherePT/1.0" },
            }
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const suburb =
              addr.suburb ||
              addr.town ||
              addr.city ||
              addr.village ||
              addr.hamlet ||
              addr.locality ||
              "";
            if (suburb) {
              onChange(suburb);
            }
          }
        } catch {
          // Silently fail
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const baseInput = dark
    ? "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
    : "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20";

  const suggestionBg = dark
    ? "bg-gray-900 border border-white/20"
    : "bg-white border border-gray-200 shadow-lg";

  const suggestionItem = dark
    ? "px-4 py-3 text-sm text-white/90 hover:bg-white/10 cursor-pointer transition-colors"
    : "px-4 py-3 text-sm text-gray-700 hover:bg-green-50 cursor-pointer transition-colors";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          setFocused(true);
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={baseInput}
        autoComplete="off"
      />

      {/* Locate button */}
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={locating}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 transition-colors ${
          dark
            ? "text-white/60 hover:text-white hover:bg-white/10"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        } ${locating ? "animate-pulse" : ""}`}
        title="Use my location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {locating ? (
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </>
          ) : (
            <>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </>
          )}
        </svg>
      </button>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg ${suggestionBg}`}
        >
          {suggestions.map((s, i) => (
            <div
              key={`${s.suburb}-${s.state}-${i}`}
              onMouseDown={() => handleSelectSuggestion(s)}
              className={suggestionItem}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 opacity-50"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{s.display}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function abbreviateState(state: string): string {
  const map: Record<string, string> = {
    "new south wales": "NSW",
    "victoria": "VIC",
    "queensland": "QLD",
    "western australia": "WA",
    "south australia": "SA",
    "tasmania": "TAS",
    "northern territory": "NT",
    "australian capital territory": "ACT",
  };
  return map[state.toLowerCase()] || state;
}
