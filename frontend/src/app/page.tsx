'use client'

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { useAuth } from "@/contexts/auth-context"; // ✅ NEW

const highlights = [
  "LLM extracts key phrases from target scholarships.",
  "Adaptive weights show exactly what a prompt values.",
  "Multiple drafts surface different experiences to pick from.",
];

export default function Home() {
  const { user } = useAuth();                    // ✅ NEW
  const startHref = user ? "/scholarships" : "/signup"; // ✅ NEW

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-16 px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <Header />

      <section className="relative overflow-hidden rounded-3xl bg-white px-8 py-16 shadow-sm sm:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-100/20 to-purple-100/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-100/20 to-indigo-100/20 blur-3xl" />
        <h1 className="relative z-10 max-w-3xl text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-[58px]">
          We help you tell <span className="italic text-indigo-600">your story</span>, so you can get that{" "}
          <span className="font-bold italic text-indigo-600">scholarship.</span>
        </h1>
        <p className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
        North Star AI helps students turn their experiences into strong scholarship applications.
        A focused, step-by-step workflow — no extras, just what gets you the scholarship.
        </p>
        <div className="relative z-10 mt-10 flex flex-wrap gap-4">
          <Link
            href={startHref}  // ✅ was "/signup"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
          >
            Start your application now
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            See how it works
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 8H12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8.5 4L12.5 8L8.5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="relative z-10 mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <Link
          href="/how-it-works"
          className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Workflow
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-gray-900">
            How it works
          </h3>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            A guided path from brainstorm to submission with checklists, templates, and feedback loops.
          </p>
        </Link>
        <Link
          href="/scholarships"
          className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Discover
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-gray-900">
            Scholarships
          </h3>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            Browse curated scholarships and find opportunities that match your profile.
          </p>
        </Link>
        <Link
          href="/prototype"
          className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Features
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-gray-900">
            Prototype
          </h3>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            See how AI generates weighted profiles and multiple essay drafts with match scores.
          </p>
        </Link>
      </section>

      <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-10 text-center shadow-sm">
        <h2 className="text-4xl font-semibold text-gray-900">
          Tell your story, compare drafts, edit with confidence.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          This is a personal build. Export drafts manually - we do not sync with Google Docs yet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={startHref}  // ✅ was "/signup"
            className="rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
          >
            Sign up with Google
          </Link>
          <Link
            href="/profile"
            className="rounded-full border-2 border-gray-300 bg-white px-7 py-3 text-base font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            Preview the workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
