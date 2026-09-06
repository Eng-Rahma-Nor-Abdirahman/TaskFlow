"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setOauthLoading("google");

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("GOOGLE_LOGIN_ERROR:", err);
      setError("Google login failed. Please try again.");
      setOauthLoading("");
    }
  }

  async function handleGitHubLogin() {
    setError("");
    setOauthLoading("github");

    try {
      await signIn("github", {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("GITHUB_LOGIN_ERROR:", err);
      setError("GitHub login failed. Please try again.");
      setOauthLoading("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-3xl font-bold tracking-tight"
          >
            <span className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-600/30">
              ✓
            </span>

            <span>
              Task<span className="text-blue-500">Flow</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white mt-8">
            Welcome back
          </h1>

          <p className="text-slate-400 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-5">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || oauthLoading !== ""}
            className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/[0.04] rounded-xl px-4 py-3.5 font-medium text-slate-200 hover:bg-white/[0.08] hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center text-sm font-bold">
              G
            </span>

            {oauthLoading === "google"
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={loading || oauthLoading !== ""}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 rounded-xl px-4 py-3.5 font-medium hover:bg-slate-200 transition mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">◉</span>

            {oauthLoading === "github"
              ? "Connecting to GitHub..."
              : "Continue with GitHub"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-white/10 flex-1" />

            <span className="text-xs font-medium text-slate-500">
              OR CONTINUE WITH
            </span>

            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading || oauthLoading !== ""}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <a
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition"
                >
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading || oauthLoading !== ""}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading || oauthLoading !== ""}
              className="w-full bg-blue-600 text-white rounded-xl px-4 py-3.5 font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{" "}

            <Link
              href="/register"
              className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}