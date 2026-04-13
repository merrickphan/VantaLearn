"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { VantaLogo } from "@/components/branding/VantaLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanta-bg flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <span className="rounded-lg p-1 ring-1 ring-sky-500/25 bg-vanta-surface-elevated">
          <VantaLogo size={28} variant="command" />
        </span>
        <span className="font-display text-vanta-text font-semibold text-lg tracking-wide">VantaLearn</span>
      </Link>

      <div className="w-full max-w-sm bg-vanta-surface border border-vanta-border rounded-card p-8 shadow-card fade-up">
        <h1 className="text-2xl font-bold text-vanta-text mb-1">Welcome back</h1>
        <p className="text-vanta-muted text-sm mb-8">Sign in to continue studying</p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-vanta-error/10 border border-vanta-error/30 rounded-lg text-vanta-error text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-vanta-surface-elevated hover:bg-vanta-surface-hover border border-vanta-border hover:border-sky-500/35 text-vanta-text rounded-lg py-2.5 text-sm font-medium transition-all mb-6 disabled:opacity-50"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-vanta-border" />
          <span className="text-vanta-muted text-xs">or</span>
          <div className="flex-1 h-px bg-vanta-border" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="student@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-vanta-muted text-sm mt-6">
          No account?{" "}
          <Link href="/auth/signup" className="text-vanta-blue hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
