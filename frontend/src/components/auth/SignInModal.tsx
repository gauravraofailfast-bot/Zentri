"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setError(null);
    // NOTE: Google OAuth must be enabled in Supabase Dashboard:
    // https://supabase.com/dashboard/project/ynpkjsfnapbhwjmkrfzc/auth/providers
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/explore` },
    });
    if (error) setError(error.message);
  }

  async function handleEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/explore` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-[#0f0f13] border border-white/[0.1] rounded-2xl p-8 shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold text-foreground mb-2">
                Get started
              </h2>
              <p className="text-sm text-white/50 mb-8">
                Sign in to explore your chapters and play games.
              </p>

              {sent ? (
                <div className="text-center py-4">
                  <div className="text-2xl mb-3">📬</div>
                  <p className="text-sm text-white/70">
                    Magic link sent to <span className="text-accent-light">{email}</span>.
                    Check your inbox.
                  </p>
                </div>
              ) : (
                <>
                  {/* Google */}
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300 mb-4"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                    <span className="text-sm text-white/80">Continue with Google</span>
                  </button>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-white/[0.08]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-xs text-white/30 bg-[#0f0f13]">or</span>
                    </div>
                  </div>

                  {/* Email OTP */}
                  <form onSubmit={handleEmailOtp}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-accent/50 outline-none text-sm text-foreground placeholder:text-white/30 mb-3 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full py-3 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-sm font-medium text-white transition-all duration-300"
                    >
                      {loading ? "Sending…" : "Send magic link"}
                    </button>
                  </form>

                  {error && (
                    <p className="mt-3 text-xs text-red-400 text-center">{error}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
