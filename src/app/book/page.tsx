"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookingCalendar } from "@/components/booking-calendar";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Trainer {
  id: number;
  slug: string;
  name: string;
  avatar_url: string | null;
  hourly_rate: number;
  home_suburb: string;
  state: string;
  session_pricing: { type: string; price: number; duration: number; description: string }[];
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

const LOCATION_OPTIONS = [
  { value: "trainer_gym", label: "Trainer's Gym", desc: "Train at your trainer's preferred gym" },
  { value: "specific_gym", label: "Specific Gym", desc: "Choose a gym near you" },
  { value: "park", label: "Park / Outdoor", desc: "Fresh air workout at a local park" },
  { value: "home", label: "Home Visit", desc: "Your trainer comes to you" },
  { value: "online", label: "Online", desc: "Virtual session via video call" },
];

function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trainerSlug = searchParams.get("trainer") || "";

  const [step, setStep] = useState(1);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Session type
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(60);

  // Step 2: Date/time
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  // Step 3: Location
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    if (!trainerSlug) return;
    async function fetchTrainer() {
      try {
        const res = await fetch(`/api/trainers/${trainerSlug}`);
        if (res.ok) {
          const data = await res.json();
          setTrainer(data.trainer || data);
        }
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchTrainer();
  }, [trainerSlug]);

  useEffect(() => {
    if (!trainerSlug) return;
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/trainers/${trainerSlug}/availability`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data.slots || []);
        }
      } catch {
        // Generate sample slots for demo
        const slots: TimeSlot[] = [];
        const today = new Date();
        for (let d = 1; d <= 14; d++) {
          const date = new Date(today);
          date.setDate(today.getDate() + d);
          if (date.getDay() !== 0) {
            const dateStr = date.toISOString().split("T")[0];
            slots.push({ date: dateStr, startTime: "07:00", endTime: "08:00" });
            slots.push({ date: dateStr, startTime: "09:00", endTime: "10:00" });
            slots.push({ date: dateStr, startTime: "16:00", endTime: "17:00" });
            slots.push({ date: dateStr, startTime: "18:00", endTime: "19:00" });
          }
        }
        setAvailableSlots(slots);
      }
    }
    fetchAvailability();
  }, [trainerSlug]);

  const handleSubmit = async () => {
    if (!trainer) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainer_id: trainer.id,
          session_type: selectedSession,
          date: selectedDate,
          start_time: selectedStartTime,
          end_time: selectedEndTime,
          location_type: selectedLocation,
          price: selectedPrice,
          duration: selectedDuration,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          router.push("/book/success");
        }
      } else {
        alert("Failed to create booking. Please try again.");
        setSubmitting(false);
      }
    } catch {
      alert("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (!trainerSlug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-warm-900">No Trainer Selected</h1>
          <p className="mt-2 text-warm-500">Please select a trainer to book a session.</p>
          <Link href="/trainers" className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            Browse Trainers
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-warm-900">Trainer Not Found</h1>
          <Link href="/trainers" className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            Browse Trainers
          </Link>
        </div>
      </div>
    );
  }

  const sessionPricing = trainer.session_pricing?.length
    ? trainer.session_pricing
    : [{ type: "1-on-1 Session", price: trainer.hourly_rate, duration: 60, description: "Personal training session" }];

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? "pm" : "am";
    const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return `${hr12}:${m}${ampm}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/trainer/${trainerSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
        <h1 className="font-display text-2xl font-bold text-warm-900 sm:text-3xl">
          Book a Session with {trainer.name}
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-10 flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step >= s ? "bg-teal-600 text-white" : "bg-warm-100 text-warm-400"
            }`}>
              {s}
            </div>
            {s < 4 && (
              <div className={`h-0.5 w-8 rounded-full sm:w-16 ${step > s ? "bg-teal-600" : "bg-warm-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Session Type */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-xl font-bold text-warm-900">Select Session Type</h2>
          <p className="mt-1 text-sm text-warm-500">Choose the type of session you would like.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sessionPricing.map((session) => (
              <button
                key={session.type}
                onClick={() => {
                  setSelectedSession(session.type);
                  setSelectedPrice(session.price);
                  setSelectedDuration(session.duration);
                }}
                className={`rounded-xl border-2 p-5 text-left transition-all ${
                  selectedSession === session.type
                    ? "border-teal-600 bg-teal-50"
                    : "border-warm-200 hover:border-warm-300"
                }`}
              >
                <h3 className="font-semibold text-warm-900">{session.type}</h3>
                <p className="mt-1 text-sm text-warm-500">{session.description}</p>
                <div className="mt-3">
                  <span className="font-display text-2xl font-bold text-teal-700">${session.price}</span>
                  <span className="text-sm text-warm-400"> / {session.duration} min</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedSession}
              className="rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date/Time */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-xl font-bold text-warm-900">Choose Date and Time</h2>
          <p className="mt-1 text-sm text-warm-500">Select an available date and time slot.</p>
          <div className="mt-6">
            <BookingCalendar
              availableSlots={availableSlots}
              selectedDate={selectedDate}
              onSelect={(date, start, end) => {
                setSelectedDate(date);
                setSelectedStartTime(start);
                setSelectedEndTime(end);
              }}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedStartTime}
              className="rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-xl font-bold text-warm-900">Choose Location</h2>
          <p className="mt-1 text-sm text-warm-500">Where would you like to train?</p>
          <div className="mt-6 space-y-3">
            {LOCATION_OPTIONS.map((loc) => (
              <label
                key={loc.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                  selectedLocation === loc.value
                    ? "border-teal-600 bg-teal-50"
                    : "border-warm-200 hover:border-warm-300"
                }`}
              >
                <input
                  type="radio"
                  name="location"
                  value={loc.value}
                  checked={selectedLocation === loc.value}
                  onChange={() => setSelectedLocation(loc.value)}
                  className="mt-0.5 h-4 w-4 border-warm-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-semibold text-warm-900">{loc.label}</span>
                  <p className="text-sm text-warm-500">{loc.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50">
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedLocation}
              className="rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Pay */}
      {step === 4 && (
        <div>
          <h2 className="font-display text-xl font-bold text-warm-900">Review and Pay</h2>
          <p className="mt-1 text-sm text-warm-500">Confirm your booking details below.</p>

          <div className="mt-6 rounded-xl border border-warm-200 bg-white">
            <div className="border-b border-warm-100 p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-xl bg-teal-50">
                  {trainer.avatar_url ? (
                    <img src={trainer.avatar_url} alt={trainer.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900">{trainer.name}</h3>
                  <p className="text-sm text-warm-500">{trainer.home_suburb}, {trainer.state}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <SummaryRow label="Session Type" value={selectedSession} />
              <SummaryRow label="Duration" value={`${selectedDuration} minutes`} />
              <SummaryRow
                label="Date"
                value={selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) : ""}
              />
              <SummaryRow label="Time" value={`${formatTime(selectedStartTime)} - ${formatTime(selectedEndTime)}`} />
              <SummaryRow
                label="Location"
                value={LOCATION_OPTIONS.find((l) => l.value === selectedLocation)?.label || selectedLocation}
              />
            </div>

            <div className="border-t border-warm-100 p-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-warm-900">Total</span>
                <span className="font-display text-2xl font-bold text-teal-700">${selectedPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(3)} className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-coral-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-60"
            >
              {submitting ? "Processing..." : `Pay $${selectedPrice}`}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-warm-400">
            Secure payment powered by Stripe. Free cancellation up to 24 hours before the session.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-warm-500">{label}</span>
      <span className="text-sm font-medium text-warm-900">{value}</span>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <BookingFlow />
    </Suspense>
  );
}
