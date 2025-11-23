'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Step = 'basic' | 'details'

type ErrorState = {
  fullName?: string
  university?: string
  programOfStudy?: string
  year?: string
  ethnicity?: string
  experiences?: string
  projects?: string
  awards?: string
  skills?: string
}

const MAX_WORDS = 2000

const ETHNICITY_OPTIONS = [
  'East Asian (e.g., Chinese, Japanese, Korean)',
  'South Asian (e.g., Indian, Pakistani, Bangladeshi, Sri Lankan)',
  'Southeast Asian (e.g., Vietnamese, Filipino, Thai, Indonesian)',
  'Black or African American',
  'Hispanic or Latino',
  'Indigenous / Native',
  'Middle Eastern / North African',
  'Pacific Islander',
  'White',
  'Prefer not to say',
]

const PROGRAM_OPTIONS = [
  'Computer Science',
  'Engineering',
  'Life Sciences',
  'Math & Statistics',
  'Commerce / Business',
  'Social Sciences',
  'Humanities',
  'Health Sciences',
  'Other',
]

const YEAR_OPTIONS = ['1', '2', '3', '4', '5+']

function countWords(text: string): number {
  return text.trim() === ''
    ? 0
    : text
        .trim()
        .split(/\s+/)
        .length
}

export default function ProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('basic')

  // Basic Information
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [programOfStudy, setProgramOfStudy] = useState('')
  const [year, setYear] = useState('')
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([])
  const [isInternationalStudent, setIsInternationalStudent] = useState(false)

  // Details
  const [experiences, setExperiences] = useState('')
  const [projects, setProjects] = useState('')
  const [awards, setAwards] = useState('')
  const [skills, setSkills] = useState('')

  const [errors, setErrors] = useState<ErrorState>({})

  const toggleEthnicity = (value: string) => {
    setSelectedEthnicities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleBasicInfoContinue = () => {
    const nextErrors: ErrorState = {}

    if (!fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }
    if (!university) {
      nextErrors.university = 'Please select your university.'
    }
    if (!programOfStudy) {
      nextErrors.programOfStudy = 'Please select your program of study.'
    }
    if (!year) {
      nextErrors.year = 'Please select your year of study.'
    }
    if (selectedEthnicities.length === 0) {
      nextErrors.ethnicity = 'Please choose at least one option.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setStep('details')
    }
  }

  const handleConfirm = () => {
    const nextErrors: ErrorState = {}

    if (!experiences.trim()) {
      nextErrors.experiences = 'Please tell us about your experiences.'
    }
    if (!projects.trim()) {
      nextErrors.projects = 'Please tell us about your projects.'
    }
    if (!awards.trim()) {
      nextErrors.awards = 'Please list your awards and recognitions.'
    }
    if (!skills.trim()) {
      nextErrors.skills = 'Please share your skills.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const profile = {
      fullName,
      university,
      programOfStudy,
      year,
      ethnicities: selectedEthnicities,
      isInternationalStudent,
      experiences,
      projects,
      awards,
      skills,
      completedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem('userProfile', JSON.stringify(profile))
    } catch (e) {
      console.error('Failed to save profile to localStorage', e)
    }

    router.push('/scholarships')
  }

  // ---------- BASIC STEP ----------
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
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.fullName
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                University <span className="text-red-500">*</span>
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.university
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
                }`}
              >
                <option value="">
                  Select your university (only UofT campuses for now)
                </option>
                <option value="uoft-st-george">
                  University of Toronto – St. George
                </option>
                <option value="uoft-scarborough">
                  University of Toronto – Scarborough
                </option>
                <option value="uoft-mississauga">
                  University of Toronto – Mississauga
                </option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                We&apos;re starting with UofT campuses. Support for more universities is
                coming soon.
              </p>
              {errors.university && (
                <p className="mt-1 text-xs text-red-500">{errors.university}</p>
              )}
            </div>

            {/* Program of Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Program of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={programOfStudy}
                onChange={(e) => setProgramOfStudy(e.target.value)}
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.programOfStudy
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
                }`}
              >
                <option value="">Select your program</option>
                {PROGRAM_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.programOfStudy && (
                <p className="mt-1 text-xs text-red-500">{errors.programOfStudy}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.year
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
                }`}
              >
                <option value="">Select your year</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-xs text-red-500">{errors.year}</p>
              )}
            </div>

            {/* Ethnicity (multi-select) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ethnicity (select one or more){' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {ETHNICITY_OPTIONS.map((option) => {
                  const checked = selectedEthnicities.includes(option)
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        checked
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={checked}
                        onChange={() => toggleEthnicity(option)}
                      />
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>
              {errors.ethnicity && (
                <p className="mt-1 text-xs text-red-500">{errors.ethnicity}</p>
              )}
            </div>

            {/* International student */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="internationalStudent"
                checked={isInternationalStudent}
                onChange={(e) => setIsInternationalStudent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
              <label
                htmlFor="internationalStudent"
                className="text-sm text-gray-700"
              >
                <span className="font-medium">Are you an international student?</span>
                <br />
                <span className="text-xs text-gray-500">
                  Check this if you are studying in Canada on a study permit or
                  similar status.
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

  // ---------- DETAILS STEP ----------
  const experiencesWords = countWords(experiences)
  const projectsWords = countWords(projects)
  const awardsWords = countWords(awards)
  const skillsWords = countWords(skills)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.svg" alt="North Star AI" width={40} height={40} />
          <span className="text-xl font-bold text-indigo-600">North Star AI</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">More About You</h1>

        <div className="mt-8 space-y-6">
          {/* Experiences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Professional / Academic Experiences (max 2000 words){' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={experiences}
              onChange={(e) => setExperiences(e.target.value)}
              className={`mt-3 w-full rounded-2xl border p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.experiences
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
              }`}
              rows={5}
              placeholder="Share your academic achievements, internships, research, teaching, or other relevant experiences..."
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">
                Try to stay under {MAX_WORDS} words.
              </span>
              <span
                className={
                  experiencesWords > MAX_WORDS ? 'text-red-500' : 'text-gray-500'
                }
              >
                {experiencesWords} / {MAX_WORDS} words
              </span>
            </div>
            {errors.experiences && (
              <p className="mt-1 text-xs text-red-500">{errors.experiences}</p>
            )}
          </div>

          {/* Projects */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Projects (max 2000 words) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              className={`mt-3 w-full rounded-2xl border p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.projects
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
              }`}
              rows={5}
              placeholder="Tell us about the projects you're proud of — research, hackathons, clubs, startups, creative work..."
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">
                Try to stay under {MAX_WORDS} words.
              </span>
              <span
                className={
                  projectsWords > MAX_WORDS ? 'text-red-500' : 'text-gray-500'
                }
              >
                {projectsWords} / {MAX_WORDS} words
              </span>
            </div>
            {errors.projects && (
              <p className="mt-1 text-xs text-red-500">{errors.projects}</p>
            )}
          </div>

          {/* Awards & Recognitions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Awards & Recognitions (max 2000 words){' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
              className={`mt-3 w-full rounded-2xl border p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.awards
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
              }`}
              rows={4}
              placeholder="List your awards, honours, scholarships, and other recognitions..."
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">
                Try to stay under {MAX_WORDS} words.
              </span>
              <span
                className={awardsWords > MAX_WORDS ? 'text-red-500' : 'text-gray-500'}
              >
                {awardsWords} / {MAX_WORDS} words
              </span>
            </div>
            {errors.awards && (
              <p className="mt-1 text-xs text-red-500">{errors.awards}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills (max 2000 words) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={`mt-3 w-full rounded-2xl border p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.skills
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
              }`}
              rows={4}
              placeholder="Describe your technical, academic, leadership, and interpersonal skills that matter for scholarships."
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">
                Try to stay under {MAX_WORDS} words.
              </span>
              <span
                className={skillsWords > MAX_WORDS ? 'text-red-500' : 'text-gray-500'}
              >
                {skillsWords} / {MAX_WORDS} words
              </span>
            </div>
            {errors.skills && (
              <p className="mt-1 text-xs text-red-500">{errors.skills}</p>
            )}
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
