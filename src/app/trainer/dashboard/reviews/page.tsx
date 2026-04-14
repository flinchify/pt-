"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { ReviewStars } from "@/components/review-stars";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  trainer_reply: string | null;
  created_at: string;
}

export default function TrainerReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/trainers/${user!.user_id}/reviews`);
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch {
        setError("Could not load reviews.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function submitReply(reviewId: number) {
    if (!user || !replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/trainers/${user.user_id}/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainer_reply: replyText }),
      });
      if (!res.ok) throw new Error("Failed to submit reply");
      toast("Reply submitted!", "success");
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, trainer_reply: replyText } : r))
      );
      setReplyingTo(null);
      setReplyText("");
    } catch {
      toast("Failed to submit reply.", "error");
    } finally {
      setSubmittingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Reviews</h1>
        <p className="mt-1 text-sm text-warm-500">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} from your clients.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No reviews yet. Reviews will appear here after clients complete sessions with you.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-warm-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-warm-800">{review.client_name}</span>
                    <ReviewStars rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-warm-600">{review.comment}</p>
                </div>
                <span className="shrink-0 text-xs text-warm-400">
                  {new Date(review.created_at).toLocaleDateString("en-AU")}
                </span>
              </div>

              {review.trainer_reply && (
                <div className="mt-4 rounded-lg border-l-4 border-teal-400 bg-teal-50 p-3">
                  <p className="text-xs font-semibold text-teal-700">Your Reply</p>
                  <p className="mt-1 text-sm text-teal-800">{review.trainer_reply}</p>
                </div>
              )}

              {!review.trainer_reply && (
                <div className="mt-3">
                  {replyingTo === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                        placeholder="Write your reply..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                          className="rounded-lg border border-warm-300 px-3 py-1.5 text-xs font-medium text-warm-600 hover:bg-warm-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitReply(review.id)}
                          disabled={submittingReply}
                          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                        >
                          {submittingReply ? "Sending..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingTo(review.id); setReplyText(""); }}
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
