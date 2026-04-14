"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "login" | "signup";
type Step = "email" | "code";

interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const reset = useCallback(() => {
    setStep("email");
    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setError("");
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setError("");
      setSubmitting(true);

      try {
        const endpoint =
          mode === "signup"
            ? "/api/auth/signup"
            : "/api/auth/login";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong. Please try again.");
          return;
        }

        setStep("code");
        setTimeout(() => codeRefs.current[0]?.focus(), 100);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, mode]
  );

  const handleCodeChange = useCallback(
    (index: number, val: string) => {
      if (val.length > 1) val = val.slice(-1);
      if (val && !/^\d$/.test(val)) return;

      const next = [...code];
      next[index] = val;
      setCode(next);

      if (val && index < 5) {
        codeRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 digits entered
      if (val && index === 5) {
        const fullCode = next.join("");
        if (fullCode.length === 6) {
          submitCode(fullCode);
        }
      }
    },
    [code]
  );

  const handleCodeKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        codeRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleCodePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted.length === 0) return;

      const next = [...code];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setCode(next);

      const focusIdx = Math.min(pasted.length, 5);
      codeRefs.current[focusIdx]?.focus();

      if (pasted.length === 6) {
        submitCode(pasted);
      }
    },
    [code]
  );

  const submitCode = useCallback(
    async (fullCode: string) => {
      setError("");
      setSubmitting(true);

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: fullCode,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid code. Please try again.");
          setCode(["", "", "", "", "", ""]);
          codeRefs.current[0]?.focus();
          return;
        }

        reset();
        onSuccess();
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, reset, onSuccess]
  );

  const handleGoogleAuth = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="font-display text-2xl font-bold text-teal-900">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-sm text-warm-500">
                  {step === "email"
                    ? mode === "login"
                      ? "Sign in to your AnywherePT account"
                      : "Start your fitness journey today"
                    : `Enter the 6-digit code sent to ${email}`}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Google OAuth */}
                    <button
                      onClick={handleGoogleAuth}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-warm-200 bg-white py-3 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <div className="my-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-warm-200" />
                      <span className="text-xs text-warm-400">or</span>
                      <div className="h-px flex-1 bg-warm-200" />
                    </div>

                    {/* Email form */}
                    <form onSubmit={handleEmailSubmit}>
                      <label className="mb-1.5 block text-sm font-medium text-warm-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      />

                      {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting || !email.trim()}
                        className="mt-4 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Sending..."
                          : mode === "login"
                          ? "Send Login Code"
                          : "Send Verification Code"}
                      </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-warm-500">
                      {mode === "login" ? (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            onClick={() => {
                              setError("");
                              onModeChange("signup");
                            }}
                            className="font-semibold text-teal-600 hover:text-teal-700"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            onClick={() => {
                              setError("");
                              onModeChange("login");
                            }}
                            className="font-semibold text-teal-600 hover:text-teal-700"
                          >
                            Log in
                          </button>
                        </>
                      )}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* 6-digit code input */}
                    <div className="flex justify-center gap-2.5">
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { codeRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(i, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(i, e)}
                          onPaste={i === 0 ? handleCodePaste : undefined}
                          className="h-14 w-11 rounded-xl border border-warm-200 text-center text-xl font-bold text-warm-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        />
                      ))}
                    </div>

                    {error && (
                      <p className="mt-3 text-center text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    {submitting && (
                      <p className="mt-3 text-center text-sm text-warm-500">
                        Verifying...
                      </p>
                    )}

                    <button
                      onClick={() => {
                        setStep("email");
                        setCode(["", "", "", "", "", ""]);
                        setError("");
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-1.5 text-sm text-warm-500 hover:text-warm-700"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to email
                    </button>

                    <button
                      onClick={() => {
                        setError("");
                        handleEmailSubmit(new Event("submit") as unknown as React.FormEvent);
                      }}
                      className="mt-2 w-full text-center text-sm text-teal-600 hover:text-teal-700"
                    >
                      Resend code
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-6 text-center text-[11px] text-warm-400">
                By continuing, you agree to our{" "}
                <a href="/terms" className="underline hover:text-warm-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-warm-600">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
