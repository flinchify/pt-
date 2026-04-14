"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BookingCard } from "@/components/booking-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Modal } from "@/components/modal";
import { ReviewStars } from "@/components/review-stars";
import { useToast } from "@/components/toast";

interface Booking {
  id: number;
  trainer_id: number;
  trainer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  location_address: string;
  status: string;
  amount_cents: number;
}

const STATUS_OPTIONS = ["all", "confirmed", "completed", "cancelled", "pending"];

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [reviewTrainerId, setReviewTrainerId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/clients/me/bookings${params}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Could not load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function openReviewModal(bookingId: number) {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    setReviewBookingId(bookingId);
    setReviewTrainerId(booking.trainer_id);
    setReviewRating(5);
    setReviewComment("");
    setReviewModalOpen(true);
  }

  async function submitReview() {
    if (!reviewBookingId || !reviewTrainerId) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/clients/me/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: reviewBookingId,
          trainer_id: reviewTrainerId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }
      toast("Review submitted successfully!", "success");
      setReviewModalOpen(false);
      fetchBookings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      toast(message, "error");
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Bookings</h1>
        <p className="mt-1 text-sm text-warm-500">View and manage your session history.</p>
      </motion.div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === s
                ? "bg-teal-600 text-white"
                : "bg-white text-warm-600 border border-warm-200 hover:bg-warm-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No bookings found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <BookingCard
                id={b.id}
                trainerName={b.trainer_name}
                date={b.date}
                startTime={b.start_time}
                endTime={b.end_time}
                sessionType={b.session_type}
                locationAddress={b.location_address}
                status={b.status}
                amountCents={b.amount_cents}
                onReview={openReviewModal}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
        <div className="p-6">
          <h2 className="mb-4 text-lg font-bold text-warm-900">Leave a Review</h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-warm-700">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={star <= reviewRating ? "#F59E0B" : "none"}
                    stroke={star <= reviewRating ? "#F59E0B" : "#CBD5E1"}
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-warm-700">Comment</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800 placeholder-warm-400"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="rounded-lg border border-warm-300 px-4 py-2 text-sm font-medium text-warm-600 hover:bg-warm-50"
            >
              Cancel
            </button>
            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
