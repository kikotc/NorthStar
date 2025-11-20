'use client'

import Link from "next/link"

const scholarshipData = [
  {
    id: "cgsm",
    name: "Canada Graduate Scholarship - Master's (CGSM)",
    match: 72,
    criteria: [
      "Domestic and international students",
      "Master's level (not co-op)",
      "Based on academic excellence, research potential and leadership",
      "Award-based"
    ],
    deadline: "Dec 1st (varies by university)",
    description: "You will have to explain the level of your problem with the problem of the world in deciding for many schools and students on your behalf without the university according to the student award in CGSM/OGS is a gateway to become a resident with your supervisor or the degree of the university. There are three tiers of awards for this scholarship. Nomination is decided by your supervisor or the degree.",
    award: "$17,500"
  },
  {
    id: "ogs",
    name: "Ontario Graduate Scholarship (OGS)",
    match: 63,
    criteria: [
      "Domestic and international students in Ontario schools",
      "Graduate program",
      "Merit and financial",
      "Leadership, research potential and academic achievements"
    ],
    deadline: "Typically late August or early September, but this varies among institutions",
    description: "Your application will be reviewed by your university's graduate studies office. There is no direct application form - you are automatically considered if you are a graduate student. OGS supports students with strong academic records and research potential in Ontario universities.",
    award: "Up to $15,000"
  },
  {
    id: "google-lime",
    name: "Google Lime",
    match: 52,
    criteria: [
      "Students with disabilities",
      "Computer Science, Computer Engineering or related field",
      "Full-time student",
      "Strong academic record"
    ],
    deadline: "December 11, 2024",
    description: "The Google Lime Scholarship aims to help students with disabilities pursue computer science and technology careers. Recipients will receive scholarship funding and an invitation to the annual Google Scholars' Retreat.",
    award: "$10,000 (US) or $5,000 (Canada)"
  }
]

export default function ScholarshipsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Scholarships</h1>

      <div className="space-y-6">
        {scholarshipData.map((scholarship) => (
          <div
            key={scholarship.name}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">{scholarship.name}</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">💰 Value</span>
                    <span>{scholarship.award}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">⏰ Deadline</span>
                    <span>{scholarship.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">🎓 Level of Study</span>
                    <span>{scholarship.criteria[1]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">⚖️ Legal Status</span>
                    <span>{scholarship.criteria[0]}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-900">Description</p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {scholarship.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 rounded-2xl bg-indigo-50/50 px-8 py-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600">{scholarship.match}%</div>
                  <div className="mt-1 text-sm font-semibold text-indigo-600">Strong Match</div>
                </div>
                
                <Link 
                  href={`/scholarships/${scholarship.id}`}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
