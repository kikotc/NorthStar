'use client'

import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"

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
]

export default function HowItWorksPage() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-16 px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <Header />

      <section className="rounded-3xl border border-gray-200/60 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Workflow
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-gray-900">
          A guided path from brainstorm to submission
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Every scholarship inside North Star AI gets a living workspace with checklists,
          essay templates, CV support, and collaborative feedback loops.
        </p>
        <div className="mt-12 space-y-6">
          {workflow.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                <Image src={step.icon} alt={step.title} width={28} height={28} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Step 0{index + 1}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-10 text-center shadow-sm">
        <h2 className="text-3xl font-semibold text-gray-900">
          Ready to get started?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Sign up to create your first scholarship workspace.
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

