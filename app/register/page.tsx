"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-blue-600/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-3xl font-bold tracking-tight"
          >
            <span className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-600/30">
              ✓
            </span>

            <span>
              Task<span className="text-blue-500">Flow</span>
            </span>
          </a>

          <h1 className="text-3xl font-bold text-white mt-8">
            Create your account
          </h1>

          <p className="text-slate-400 mt-2">
            Start organizing your tasks today
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/[0.04] rounded-xl px-4 py-3.5 font-medium text-slate-200 hover:bg-white/[0.08] hover:border-white/20 transition"
          >
            <span className="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center text-sm font-bold">
              G
            </span>

            Continue with Google
          </button>

          {/* GitHub */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 rounded-xl px-4 py-3.5 font-medium hover:bg-slate-200 transition mt-3"
          >
            <span className="text-lg">◉</span>

            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-white/10 flex-1" />

            <span className="text-xs font-medium text-slate-500">
              OR CONTINUE WITH
            </span>

            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                required
                minLength={6}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-xl px-4 py-3.5 font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to home
          </a>
        </div>

      </div>
    </main>
  );
}