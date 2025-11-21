'use client'

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function DraftPage() {
  const params = useParams()
  const id = params.id as string
  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState(`Academic Excellence and Research Vision

I am pursuing a [degree program name] degree at [University name], building a cumulative GPA of 3.92/4.0 while pursuing a rigorous course load that balances theoretical foundations with hands-on research opportunities. My deep commitment to pushing beyond conventional boundaries. Courses in advanced [specific courses] not only strengthened my theoretical foundation but also primed my passion for addressing [specific research topic].

My senior thesis, which examined [topic], earned departmental honors and was selected for presentation at the [Conference Name]. This work revealed a critical gap in current understanding of [specific problem], which will form the foundation of my master's research.

Research Proposal: Addressing [Research Question]

My proposed master's research investigates [specific research question], a pressing issue with significant implications for [field/society]. Current approaches to [problem] remain limited by [specific limitation or gap]. This project is innovative in three key ways. First, it employs [novel method/approach] to overcome [methodological constraints]. Second, it bridges [discipline A] and [discipline B], creating an interdisciplinary framework for [application goal]. Finally, the methodology will directly inform [practical application], translating academic inquiry into tangible impact.

Working under the supervision of Dr. [Name] at [University], whose expertise in [area] aligns perfectly with my research objectives, I will leverage [specific resources/facilities] to execute this ambitious project. My timeline includes [brief overview of phases]. With anticipated outcomes including [expected results], this work will advance [field] while contributing to [broader societal goal].

Leadership and Community Engagement`)

  const reasoningItems = [
    {
      title: "Leveraging Academic Performance",
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
    },
    {
      title: "Using Past Experience to Inform Research",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  ]

  const scholarshipNames: Record<string, string> = {
    "cgsm": "Canada Graduate Scholarship – Master's (CGSM)",
    "ogs": "Ontario Graduate Scholarship (OGS)",
    "google-lime": "Google Lime Scholarship"
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Link href={`/scholarships/${id}`} className="text-indigo-500 hover:text-indigo-600 font-medium">
          ← Back to Scholarship Details
        </Link>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">DRAFTING PAGE</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side - Draft Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Weight Profile:</span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600">
                  Academic Excellence
                </span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <span>✏️</span>
                <span>{isEditing ? 'Viewing Mode' : 'Editing Mode'}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              Personal Statement: {scholarshipNames[id] || "Scholarship"}
            </h1>

            {/* Draft Content */}
            {isEditing ? (
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="min-h-[500px] w-full rounded-2xl border border-gray-300 bg-gray-50 p-6 text-gray-900 leading-relaxed focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            ) : (
              <div className="prose max-w-none">
                {draftContent.split('\n\n').map((paragraph, index) => {
                  const isHeading = paragraph.match(/^[A-Z][^.]*$/) && paragraph.length < 100
                  return isHeading ? (
                    <h2 key={index} className="mt-6 mb-3 text-lg font-semibold text-gray-900">
                      {paragraph}
                    </h2>
                  ) : (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            )}

            {/* Prove AI Wrong Input */}
            <div className="mt-6 rounded-2xl border border-gray-300 bg-gray-50 p-4">
              <input
                type="text"
                placeholder="Prove North Star AI is a Liar Call"
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Save Draft Button */}
            <button className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700">
              Save Draft
            </button>
          </div>
        </div>

        {/* Right Side - Reasoning */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Reasoning</h2>

            {/* Reasoning Type Pills */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                Academic Excellence
              </button>
              <button className="rounded-full border-2 border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Leadership Stories
              </button>
            </div>

            {/* Reasoning Items */}
            <div className="space-y-6">
              {reasoningItems.map((item, index) => (
                <div key={index}>
                  <h3 className="mb-3 font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
