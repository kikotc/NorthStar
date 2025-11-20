'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<'basic' | 'details'>('basic')
  
  // Basic Information
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [programOfStudy, setProgramOfStudy] = useState('')
  const [year, setYear] = useState('')
  const [ethnicity, setEthnicity] = useState('')
  const [isDomesticStudent, setIsDomesticStudent] = useState(false)
  
  // More About You
  const [experiences, setExperiences] = useState('')
  const [passionProjects, setPassionProjects] = useState('')
  const [awards, setAwards] = useState('')

  const handleBasicInfoContinue = () => {
    setStep('details')
  }

  const handleConfirm = () => {
    // Store the data locally (no backend)
    localStorage.setItem('userProfile', JSON.stringify({
      fullName,
      university,
      programOfStudy,
      year,
      ethnicity,
      isDomesticStudent,
      experiences,
      passionProjects,
      awards,
      completedAt: new Date().toISOString()
    }))
    // Redirect to scholarships page
    router.push('/scholarships')
  }

  if (step === 'basic') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/logo.svg" alt="North Star AI" width={40} height={40} />
            <span className="text-xl font-bold text-indigo-600">North Star AI</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Basic Information</h1>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Value"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Value</option>
                <option value="Harvard University">Harvard University</option>
                <option value="Stanford University">Stanford University</option>
                <option value="MIT">MIT</option>
                <option value="Yale University">Yale University</option>
                <option value="Princeton University">Princeton University</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Program of Study</label>
              <select
                value={programOfStudy}
                onChange={(e) => setProgramOfStudy(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Value</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Medicine">Medicine</option>
                <option value="Law">Law</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Value</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Value</option>
                <option value="Asian">Asian</option>
                <option value="Black or African American">Black or African American</option>
                <option value="Hispanic or Latino">Hispanic or Latino</option>
                <option value="White">White</option>
                <option value="Native American">Native American</option>
                <option value="Pacific Islander">Pacific Islander</option>
                <option value="Two or More Races">Two or More Races</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="domesticStudent"
                checked={isDomesticStudent}
                onChange={(e) => setIsDomesticStudent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
              <label htmlFor="domesticStudent" className="text-sm text-gray-700">
                <span className="font-medium">Are you a Domestic Student?</span>
                <br />
                <span className="text-xs text-gray-500">
                  I've lived in Ontario for the past 6 months, and/or I'm a Canadian citizen.
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

  if (step === 'details') {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/logo.svg" alt="North Star AI" width={40} height={40} />
            <span className="text-xl font-bold text-indigo-600">North Star AI</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">More About You</h1>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please write about your Professional/Academic experiences (max 500 words).
              </label>
              <textarea
                value={experiences}
                onChange={(e) => setExperiences(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={4}
                placeholder="Share your academic achievements, internships, research, etc..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please write about your interests in Passion Projects (max 500 words).
              </label>
              <textarea
                value={passionProjects}
                onChange={(e) => setPassionProjects(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={4}
                placeholder="Tell us about projects you're passionate about..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please list your Awards and Recognitions.
              </label>
              <textarea
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={3}
                placeholder="List your awards, honors, and recognitions..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setStep('basic')}
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
}
