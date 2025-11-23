'use client'

import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"

const weightProfile = [
  { label: "GPA & coursework", value: 40 },
  { label: "Leadership impact", value: 20 },
  { label: "Community service", value: 25 },
  { label: "Innovation keywords", value: 15 },
]

const essayOptions = [
  {
    variant: "Option A — Systems Thinker",
    match: 92,
    summary:
      "Prioritizes academic rigor and leadership to align with the merit-heavy weight profile.",
    keywords: "Keywords: GPA, robotics, innovation, mentorship",
    experiences: [
      {
        title: "Quantum engineering lab assistant",
        match: 90,
        reason: "Directly supports the GPA + innovation emphasis the model detected.",
      },
      {
        title: "Robotics captain (state finalist)",
        match: 87,
        reason: "High leadership weight, highlights mentoring 28 younger builders.",
      },
      {
        title: "AP Calculus tutoring collective",
        match: 84,
        reason: "Shows measurable teaching impact while keeping academic focus.",
      },
    ],
  },
  {
    variant: "Option B — Community Builder",
    match: 88,
    summary:
      "Shifts the story toward service, showing how tech projects solve real campus problems.",
    keywords: "Keywords: community, resilience, peer programs",
    experiences: [
      {
        title: "Campus Wi-Fi equity rollout",
        match: 85,
        reason: "Connects community service weight to measurable infrastructure change.",
      },
      {
        title: "First-gen leadership summit host",
        match: 83,
        reason: "Addresses leadership + service simultaneously with qualitative impact.",
      },
      {
        title: "Storytelling nights for freshmen",
        match: 80,
        reason: "Highlights empathy and narrative skill valued by the prompt.",
      },
    ],
  },
]

export default function PrototypePage() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-16 px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <Header />

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">
            Weight profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">
            LLM prioritizes what the prompt really wants
          </h1>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            Paste a scholarship description and the model outputs an adaptive weight
            profile that guides every draft.
          </p>
          <div className="mt-6 space-y-4">
            {weightProfile.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <p>{item.label}</p>
                  <p className="font-bold text-indigo-600">{item.value}%</p>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 shadow-sm"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Example: &quot;Merit-focused&quot; prompt pushes GPA to the top while still rewarding
            leadership and service.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">
            Draft explainability
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900">
            Every essay comes with match reasoning
          </h2>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            Quantitative match score + qualitative summary shows why a version aligns with
            the scholarship request.
          </p>
          <div className="mt-5 grid gap-4">
            {essayOptions.map((option) => (
              <div key={option.variant} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      {option.variant}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{option.summary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-indigo-600">{option.match}%</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      Keyword match
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{option.keywords}</p>
                <div className="mt-4 space-y-3">
                  {option.experiences.map((experience) => (
                    <div key={experience.title}>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <p className="text-sm font-semibold text-gray-900">{experience.title}</p>
                        <p className="text-sm text-indigo-600">{experience.match}%</p>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${experience.match}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{experience.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-10 text-center shadow-sm">
        <h2 className="text-3xl font-semibold text-gray-900">
          Ready to try it yourself?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Sign up to start generating your own scholarship essays.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
          >
            Sign up with Google
          </Link>
          <Link
            href="/"
            className="rounded-full border-2 border-gray-300 bg-white px-7 py-3 text-base font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  )
}

