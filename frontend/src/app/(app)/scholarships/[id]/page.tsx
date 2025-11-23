'use client'

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

const scholarshipsData: Record<string, any> = {
  "cgsm": {
    name: "Canada Graduate Scholarship – Master's (CGSM)",
    match: 72,
    value: "$27,000 for one year (non-renewable)",
    deadline: "December 1, 2025 at 8:00 PM (ET)",
    levelOfStudy: "Master's and Doctoral",
    legalStatus: "Canadian citizens, permanent residents, or protected persons.",
    description: "The CGS-M aims to support the next generation of innovators by providing funding and high-quality research training, cultivating research skills, fostering creativity, and empowering awareness to make significant contributions to Canada's research ecosystem, economy, and prosperity.",
    criteria: [
      "Academic excellence (GPA)",
      "Strong research proposal",
      "Clear communication of research plan",
      "Evidence of leadership or volunteering"
    ],
    weightProfiles: [
      {
        title: "Academic Excellence",
        percentage: 80,
        reasoning: "Academic excellence was mentioned directly in the official website as one of the top requirements. Multiple sections in the award description mention academic merit..."
      },
      {
        title: "Research Plan",
        percentage: 75,
        reasoning: "Academic excellence was mentioned directly in the official website as one of the top requirements. Multiple sections in the award description mention academic merit..."
      },
      {
        title: "Leadership/Volunteering",
        percentage: 60,
        reasoning: "Academic excellence was mentioned directly in the official website as one of the top requirements. Multiple sections in the award description mention academic merit..."
      }
    ]
  },
  "ogs": {
    name: "Ontario Graduate Scholarship (OGS)",
    match: 63,
    value: "Up to $15,000",
    deadline: "Typically late August or early September, but this varies among institutions",
    levelOfStudy: "Graduate program",
    legalStatus: "Domestic and international students in Ontario schools",
    description: "Your application will be reviewed by your university's graduate studies office. There is no direct application form - you are automatically considered if you are a graduate student. OGS supports students with strong academic records and research potential in Ontario universities.",
    criteria: [
      "Merit and financial need",
      "Leadership, research potential",
      "Academic achievements"
    ],
    weightProfiles: [
      {
        title: "Academic Excellence",
        percentage: 85,
        reasoning: "Strong academic records are the primary criteria for OGS selection..."
      },
      {
        title: "Research Plan",
        percentage: 70,
        reasoning: "Research potential is a key factor in the selection process..."
      },
      {
        title: "Leadership/Volunteering",
        percentage: 55,
        reasoning: "Leadership qualities contribute to the overall application strength..."
      }
    ]
  },
  "google-lime": {
    name: "Google Lime",
    match: 52,
    value: "$10,000 (US) or $5,000 (Canada)",
    deadline: "December 11, 2024",
    levelOfStudy: "Full-time student",
    legalStatus: "Students with disabilities",
    description: "The Google Lime Scholarship aims to help students with disabilities pursue computer science and technology careers. Recipients will receive scholarship funding and an invitation to the annual Google Scholars' Retreat.",
    criteria: [
      "Computer Science, Computer Engineering or related field",
      "Strong academic record",
      "Demonstrated leadership"
    ],
    weightProfiles: [
      {
        title: "Academic Excellence",
        percentage: 75,
        reasoning: "Strong academic records in CS/Engineering are required..."
      },
      {
        title: "Research Plan",
        percentage: 65,
        reasoning: "Technology focus and career goals are important..."
      },
      {
        title: "Leadership/Volunteering",
        percentage: 70,
        reasoning: "Demonstrated leadership in the disability community is valued..."
      }
    ]
  }
}

export default function ScholarshipDetailPage() {
  const params = useParams()
  const id = params.id as string
  const scholarship = scholarshipsData[id]
  const [expandedProfiles, setExpandedProfiles] = useState<Record<number, boolean>>({})
  const [selectedProfiles, setSelectedProfiles] = useState<Set<number>>(new Set())
  const [showMoreDescription, setShowMoreDescription] = useState(false)

  if (!scholarship) {
    return (
      <div className="text-center text-white">
        <h1 className="text-2xl">Scholarship not found</h1>
        <Link href="/scholarships" className="text-indigo-400 hover:underline">
          Back to Scholarships
        </Link>
      </div>
    )
  }

  const toggleProfile = (index: number) => {
    setExpandedProfiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleSelectProfile = (index: number) => {
    setSelectedProfiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link href="/scholarships" className="text-indigo-500 hover:text-indigo-600 font-medium">
          ← Back to Scholarships
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Badge */}
          <div className="inline-block rounded-2xl bg-indigo-100 px-4 py-2">
            <span className="text-lg font-semibold text-indigo-600">
              {scholarship.match}% Match to Your Profile:{" "}
            </span>
            <span className="text-sm text-gray-600">Masters, Domestic, Strong GPA</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white">{scholarship.name}</h1>

          {/* Key Information */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Key Information</h2>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <span>💰</span>
                <div>
                  <span className="font-semibold text-gray-900">Value</span>
                  <p className="text-gray-600">{scholarship.value}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span>⏰</span>
                <div>
                  <span className="font-semibold text-gray-900">Deadline</span>
                  <p className="text-gray-600">{scholarship.deadline}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span>🎓</span>
                <div>
                  <span className="font-semibold text-gray-900">Level of Study</span>
                  <p className="text-gray-600">{scholarship.levelOfStudy}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span>🌍</span>
                <div>
                  <span className="font-semibold text-gray-900">Legal Status</span>
                  <p className="text-gray-600">{scholarship.legalStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{scholarship.description}</p>
            {!showMoreDescription && (
              <button 
                onClick={() => setShowMoreDescription(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm cursor-pointer transition"
              >
                Learn More →
              </button>
            )}
            {showMoreDescription && (
              <div className="mt-4">
                <p className="text-gray-600 leading-relaxed mb-4">
                  For more detailed information about this scholarship, including application requirements, 
                  eligibility criteria, and submission guidelines, please visit the official scholarship website 
                  or contact the scholarship provider directly.
                </p>
                <button 
                  onClick={() => setShowMoreDescription(false)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm cursor-pointer transition"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>

          {/* Criteria */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Criteria</h2>
            <ul className="space-y-2">
              {scholarship.criteria.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Weight Profiles - Right Side */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Generated Weight Profiles:</h2>
            
            <div className="space-y-4">
              {scholarship.weightProfiles.map((profile: any, index: number) => (
                <div 
                  key={index} 
                  onClick={() => toggleSelectProfile(index)}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    selectedProfiles.has(index)
                      ? 'border-indigo-500 bg-indigo-100/70 shadow-md'
                      : 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedProfiles.has(index)}
                        onChange={() => toggleSelectProfile(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <h3 className="font-semibold text-gray-900">{profile.title}</h3>
                    </div>
                    <span className="text-3xl font-bold text-indigo-600">{profile.percentage}%</span>
                  </div>
                  <p className={`text-xs text-gray-600 leading-relaxed ${expandedProfiles[index] ? '' : 'line-clamp-2'}`}>
                    <span className="font-semibold">Reasoning:</span> {profile.reasoning}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleProfile(index)
                    }}
                    className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer transition"
                  >
                    {expandedProfiles[index] ? 'Read Less' : 'Read More →'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="text-indigo-400">✓</span>
              <span>Select one or More Weight Profiles to <span className="text-indigo-400">Draft with North Star</span></span>
            </div>
            <Link 
              href={`/scholarships/${id}/draft`}
              className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
            >
              DRAFT NOW WITH NORTH STAR AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
