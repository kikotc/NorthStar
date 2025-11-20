'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const benefits = [
  "Secure Google single sign-on",
  "LLM weight profile saved inside the dashboard",
  "Two to four draft options per scholarship prompt",
];

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Show success message
      setError('Check your email to confirm your account!')
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-4 py-16 md:flex-row md:items-center">
      <section className="flex-1 space-y-8 p-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="North Star AI logo" width={48} height={48} />
          <p className="text-2xl font-bold text-indigo-600">North Star AI</p>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white">
          Designed for students like you, North Star AI helps you get <span className="italic">that scholarship.</span>
        </h1>
        <ul className="space-y-3 text-base text-white">
          <li className="flex items-start gap-2">
            <span className="font-semibold">1.</span>
            <span>Matches you with scholarships...</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>Analyzes your strengths against scholarship criteria</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>Drafts tailored personal essays based on criteria</span>
          </li>
        </ul>
      </section>

      <section className="flex-1 rounded-3xl border border-gray-200 bg-white p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/google.svg" alt="Google icon" width={24} height={24} />
          {loading ? 'Loading...' : 'Continue with Google'}
        </button>
        <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        {error && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${
            error.includes('Check your email') 
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-red-300 bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}
        <form onSubmit={handleEmailSignUp} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              placeholder="Value"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              placeholder="Value"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/profile" className="font-semibold text-indigo-600 hover:underline">
            Log In.
          </Link>
        </p>
      </section>
    </main>
  );
}
