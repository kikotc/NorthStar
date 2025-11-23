'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const PROGRAM_OPTIONS = [
  "Computer Science",
  "Engineering",
  "Business / Commerce",
  "Life Sciences",
  "Medicine (Pre-Med / Med)",
  "Law (Pre-Law / JD)",
  "Social Sciences",
  "Humanities",
  "Other",
]

const ETHNICITY_OPTIONS = [
  "East Asian",
  "South Asian",
  "Southeast Asian",
  "Middle Eastern / North African",
  "Black / African",
  "Latino / Hispanic",
  "White / European",
  "Indigenous / First Nations / Inuit / Métis",
  "Prefer not to say",
]

export default function ProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<"basic" | "details">("basic")

  // Basic Information
  const [fullName, setFullName] = useState("")
  const [university, setUniversity] = useState("")
  const [programOfStudy, setProgramOfStudy] = useState("")
  const [year, setYear] = useState("")
  const [ethnicities, setEthnicities] = useState<string[]>([])
  const [isInternational, setIsInternational] = useState(false)

  // More About You
  const [experiences, setExperiences] = useState("")
  const [passionProjects, setPassionProjects] = useState("")
  const [awards, setAwards] = useState("")

  // Simple error messages
  const [basicError, setBasicError] = useState<string | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const toggleEthnicity = (value: string) => {
    setEthnicities(prev =>
      prev.includes(value) ? prev.filter(e => e !== value) : [...prev, value]
    )
  }

  const handleBasicInfoContinue = () => {
    setBasicError(null)

    if (
      !fullName.trim() ||
      !university ||
      !programOfStudy ||
      !year
    ) {
      setBasicError("Please fill out all required fields before continuing.")
      return
    }

    setStep("details")
  }

  const handleConfirm = () => {
    setDetailsError(null)

    if (
      !experiences.trim() ||
      !passionProjects.trim() ||
      !awards.trim()
    ) {
      setDetailsError("Please complete all sections before confirming.")
      return
    }

    // Store the data locally (for now)
    const profile = {
      fullName,
      university,
      programOfStudy,
      year,
      ethnicities,
      isInternational, // optional
      experiences,
      passionProjects,
      awards,
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("userProfile", JSON.stringify(profile))

    // Later: also POST this profile to the backend /api/profile

    router.push("/scholarships")
  }

  if (step === "basic") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/logo.svg" alt="North Star AI" width={40} height={40} />
            <span className="text-xl font-bold text-indigo-600">North Star AI</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Basic Information</h1>

          {basicError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {basicError}
            </p>
          )}

          <div className="mt-8 space-y-6">
            {/* Full name (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full legal name"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* University (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                University <span className="text-red-500">*</span>
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">
                  Select your university (U of T only for now)
                </option>
                <option value="UofT - St. George">University of Toronto – St. George</option>
                <option value="UofT - Scarborough">University of Toronto – Scarborough</option>
                <option value="UofT - Mississauga">University of Toronto – Mississauga</option>
                <option value="Other (coming soon)">Other (more universities coming soon)</option>
              </select>
            </div>

            {/* Program of study (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Program of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={programOfStudy}
                onChange={(e) => setProgramOfStudy(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select your program</option>
                {PROGRAM_OPTIONS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            {/* Year (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select your year</option>
                <option value="1">1st year</option>
                <option value="2">2nd year</option>
                <option value="3">3rd year</option>
                <option value="4">4th year</option>
                <option value="5+">5th year or above</option>
              </select>
            </div>

            {/* Ethnicity (multi-select, effectively required by spec? you didn't say, so leaving optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ethnicity (select all that apply)
              </label>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ETHNICITY_OPTIONS.map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={ethnicities.includes(label)}
                      onChange={() => toggleEthnicity(label)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* International status (optional) */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="internationalStudent"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
              <label htmlFor="internationalStudent" className="text-sm text-gray-700">
                <span className="font-medium">Are you an International Student?</span>
                <br />
                <span className="text-xs text-gray-500">
                  Check this if you are studying in Canada on a study permit or visa.
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleBasicInfoContinue}
            className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // DETAILS STEP
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.svg" alt="North Star AI" width={40} height={40} />
          <span className="text-xl font-bold text-indigo-600">North Star AI</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">More About You</h1>

        {detailsError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {detailsError}
          </p>
        )}

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Professional / Academic experiences (max 500 words) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={experiences}
              onChange={(e) => setExperiences(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={4}
              placeholder="Share your academic achievements, internships, research, or work experience."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passion projects (max 500 words) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={passionProjects}
              onChange={(e) => setPassionProjects(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={4}
              placeholder="Tell us about side projects, clubs, or creative work you care about."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Awards and recognitions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={3}
              placeholder="Scholarships, competitions, publications, leadership awards, etc."
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setStep("basic")}
            className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
