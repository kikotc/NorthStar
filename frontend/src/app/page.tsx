'use client'

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "How it works", href: "#workflow" },
  { label: "Scholarships", href: "#scholarships" },
  { label: "Prototype", href: "#prototype" },
];

function AuthButtons() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/signup"
        className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Sign up
      </Link>
    </div>
  )
}

const highlights = [
  "LLM extracts key phrases from target scholarships.",
  "Adaptive weights show exactly what a prompt values.",
  "Multiple drafts surface different experiences to pick from.",
];

const workflow = [
  {
    title: "Input your core experiences",
    description:
      "Students drop in achievements, context, and metrics. We structure them so the LLM can reference each story later.",
    icon: "/file.svg",
  },
  {
    title: "Paste the scholarship prompt",
    description:
      "The model scans the description and produces a weighted profile (e.g., Merit-focused: GPA 40%, Leadership 20%).",
    icon: "/globe.svg",
  },
  {
    title: "Generate drafts with match scores",
    description:
      "Each draft explains its keyword match, why it fits the prompt, and which experiences it emphasizes.",
    icon: "/window.svg",
  },
  {
    title: "Choose & edit your favorite",
    description:
      "Students pick the version that feels right and make final edits directly inside the workspace.",
    icon: "/window.svg",
  },
];

const weightProfile = [
  { label: "GPA & coursework", value: 40 },
  { label: "Leadership impact", value: 20 },
  { label: "Community service", value: 25 },
  { label: "Innovation keywords", value: 15 },
];

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
];

const testimonials = [
  {
    quote:
      "North Star AI felt like a scholarship coach who already knew me. I walked into interviews with clear stories and zero panic.",
    author: "Chelsea Alvarez",
    title: "Gates Scholarship Scholar",
  },
  {
    quote:
      "Tracking fifteen deadlines while juggling AP exams was impossible--until North Star automated reminders and drafts for me.",
    author: "Zuraan Khan",
    title: "STEM Innovators Grant",
  },
];

const scholarships = [
  {
    name: "Nova Scholars",
    amount: "$12,000",
    due: "Dec 12",
    tags: ["Essay", "Leadership", "STEM"],
  },
  {
    name: "Future Storytellers",
    amount: "$5,000",
    due: "Jan 8",
    tags: ["First-gen", "Video pitch"],
  },
  {
    name: "Community Catalyst Award",
    amount: "$8,500",
    due: "Feb 2",
    tags: ["Service", "Letters", "Essay"],
  },
];

const stats = [
  { label: "Scholarship prompts tested", value: "32" },
  { label: "Draft variations per prompt", value: "2 - 4" },
  { label: "Custom weight profiles generated", value: "32" },
];

export default function Home() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-16 px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <header className="flex flex-col gap-4 rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="North Star AI logo" width={40} height={40} />
          <div>
            <p className="text-base font-semibold tracking-wide text-gray-900">
              North Star AI
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
              Scholarship Copilot
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <AuthButtons />
      </header>

      <section className="relative overflow-hidden rounded-3xl bg-white px-8 py-16 shadow-sm sm:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-100/20 to-purple-100/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-100/20 to-indigo-100/20 blur-3xl" />
        <h1 className="relative z-10 max-w-3xl text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-[58px]">
          We help you tell <span className="italic text-indigo-600">your story</span>, so you can get that{" "}
          <span className="font-bold italic text-indigo-600">scholarship.</span>
        </h1>
        <p className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          This is a personal project that prototypes how an LLM could convert your experiences
          and a scholarship prompt into weighted priorities and multiple drafts. No pricing plans,
          no Google Docs sync yet - just a focused essay workflow.
        </p>
        <div className="relative z-10 mt-10 flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
          >
            Start your application now
          </Link>
          <a
            href="#workflow"
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
          </a>
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

      <section id="prototype" className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">
            Weight profile
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-gray-900">
            LLM prioritizes what the prompt really wants
          </h3>
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
          <h3 className="mt-3 text-2xl font-semibold text-gray-900">
            Every essay comes with match reasoning
          </h3>
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

      <section id="workflow" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200/60 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Workflow
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900">
            A guided path from brainstorm to submission
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Every scholarship inside North Star AI gets a living workspace with checklists,
            essay templates, CV support, and collaborative feedback loops.
          </p>
          <div className="mt-8 space-y-5">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                  <Image src={step.icon} alt={step.title} width={28} height={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Step 0{index + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          id="scholarships"
          className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-indigo-600">
                Next up
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                Scholarships curated for you
              </h3>
            </div>
            <Link
              href="/scholarships"
              className="text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline"
            >
              View list
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.name}
                className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="font-semibold text-indigo-600">{scholarship.amount}</p>
                    <h4 className="text-base font-semibold text-gray-900">
                      {scholarship.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                      Due
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {scholarship.due}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {scholarship.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
            href="/signup"
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
