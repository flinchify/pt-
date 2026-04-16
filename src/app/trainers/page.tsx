"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TrainerCard } from "@/components/trainer-card";
import { SearchFilters, defaultFilterValues, type FilterValues } from "@/components/search-filters";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AnimateIn } from "@/components/animate-in";

interface Trainer {
  id: number;
  slug: string;
  name: string;
  avatar_url?: string;
  photo_url?: string;
  verified: boolean;
  specialisations: string[];
  avg_rating: number;
  review_count: number;
  hourly_rate: number;
  home_suburb: string;
  state: string;
}

interface TrainersResponse {
  trainers: Trainer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function TrainersPageContent() {
  const searchParams = useSearchParams();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const initialLocation = searchParams.get("suburb") || "";
  const initialSpec = searchParams.get("specialisation") || "";

  const [filters, setFilters] = useState<FilterValues>({
    ...defaultFilterValues,
    location: initialLocation,
    specialisations: initialSpec ? [initialSpec] : [],
  });

  const fetchTrainers = useCallback(async (f: FilterValues, p: number, sort?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "12");
      if (f.location) params.set("suburb", f.location);
      if (f.specialisations.length > 0) params.set("specialisation", f.specialisations[0]);
      if (f.priceRange[0] > 30) params.set("min_price", String(f.priceRange[0]));
      if (f.priceRange[1] < 300) params.set("max_price", String(f.priceRange[1]));
      if (f.minRating > 0) params.set("min_rating", String(f.minRating));
      if (f.sessionType !== "all") params.set("session_type", f.sessionType);
      if (sort && sort !== "rating") params.set("sort", sort);

      const res = await fetch(`/api/trainers?${params.toString()}`);
      const data: TrainersResponse = await res.json();
      setTrainers(data.trainers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers(filters, page, sortBy);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTrainers(filters, 1, sortBy);
    setPage(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    setPage(1);
    fetchTrainers(filters, 1, sortBy);
    setMobileFiltersOpen(false);
  };

  const handleReset = () => {
    const resetFilters = { ...defaultFilterValues };
    setFilters(resetFilters);
    setSortBy("rating");
    setPage(1);
    fetchTrainers(resetFilters, 1, "rating");
  };

  const handleSort = (val: string) => {
    setSortBy(val);
    setPage(1);
    fetchTrainers(filters, 1, val);
  };

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-warm-200/60 bg-cream py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Our Trainers</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
            Find Personal Trainers
          </h1>
          <p className="mt-2 text-warm-500">
            Browse verified trainers across Australia
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile filter toggle */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-warm-500">
            Showing {trainers.length} of {total} trainers
          </p>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 rounded-full border border-warm-200 px-4 py-2 text-sm font-medium text-warm-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`shrink-0 ${mobileFiltersOpen ? "fixed inset-0 z-40 overflow-y-auto bg-white p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0" : "hidden lg:block"} lg:w-72`}>
            {mobileFiltersOpen && (
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <h2 className="font-display text-lg font-bold text-warm-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-warm-500" aria-label="Close filters">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <SearchFilters
              values={filters}
              onChange={setFilters}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-sm text-warm-500">
                Showing {trainers.length} of {total} trainers
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm text-warm-500">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="rounded-lg border border-warm-200 px-3 py-1.5 text-sm text-warm-700"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
              <button
                onClick={() => setMapView(!mapView)}
                className="flex items-center gap-2 rounded-full border border-warm-200 px-4 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mapView ? (
                    <>
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </>
                  ) : (
                    <>
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </>
                  )}
                </svg>
                {mapView ? "Grid View" : "Map View"}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : mapView ? (
              <div className="flex h-[500px] items-center justify-center rounded-2xl border border-warm-200 bg-warm-50">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-warm-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  <p className="mt-3 text-sm text-warm-500">Map view coming soon</p>
                </div>
              </div>
            ) : trainers.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {trainers.map((t, i) => (
                    <AnimateIn key={t.id || i} delay={i * 50}>
                      <TrainerCard
                        slug={t.slug || `trainer-${t.id}`}
                        name={t.name}
                        photoUrl={t.avatar_url || t.photo_url}
                        verified={t.verified}
                        specialisations={t.specialisations || []}
                        avgRating={t.avg_rating || 0}
                        reviewCount={t.review_count || 0}
                        hourlyRate={t.hourly_rate || 0}
                        suburb={t.home_suburb || ""}
                        state={t.state || ""}
                      />
                    </AnimateIn>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-full border border-warm-200 px-4 py-2 text-sm text-warm-600 transition-colors hover:bg-warm-50 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                            page === p
                              ? "bg-teal-600 text-white"
                              : "border border-warm-200 text-warm-600 hover:bg-warm-50"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="px-2 text-warm-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-full border border-warm-200 px-4 py-2 text-sm text-warm-600 transition-colors hover:bg-warm-50 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <svg className="mx-auto h-12 w-12 text-warm-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-teal-600">Search Results</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-warm-700">No trainers found</h3>
                <p className="mt-1 text-sm text-warm-500">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function TrainersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>}>
      <TrainersPageContent />
    </Suspense>
  );
}
