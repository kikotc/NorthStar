'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

// ---------- Types ----------

type Scholarship = {
  id: string | number;
  name: string;
  description?: string;
  offered_by?: string;
  citizenship?: string;
  deadline?: string | null;
  value?: string | null;
  category?: string | null;
};

type PrioritySuggestion = {
  name: string;
  weight: number;
  reason?: string;
};

type ScholarshipAnalysis = {
  scholarship_id: string;
  scholarship_title: string;
  institution: string;
  priorities: PrioritySuggestion[];
  essay_strategies?: string[];
};

type EssayStudentProfile = {
  full_name: string;
  university?: string;
  program?: string;
  year?: number;
  residency_status?: 'domestic' | 'international';
  experiences: string[];
  interests: string[];
  awards: string[];
};

type EssayResponse = {
  essay: string;
  scholarship_id: string;
  scholarship_title?: string | null;
  winner_story_id?: string | null;
  winner_story_recipient_name?: string | null;
  priorities: { name: string; weight: number }[];
};

// ---------- helpers ----------

const UNIVERSITY_LABELS: Record<string, string> = {
  'uoft-st-george': 'University of Toronto – St. George',
  'uoft-scarborough': 'University of Toronto – Scarborough',
  'uoft-mississauga': 'University of Toronto – Mississauga',
};

function splitToList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Build the essay student profile from localStorage (same data source as matches).
 */
function buildEssayStudentProfile(): EssayStudentProfile | null {
  if (typeof window === 'undefined') return null;

  const rawJson = window.localStorage.getItem('userProfile');
  if (!rawJson) return null;

  try {
    const raw = JSON.parse(rawJson);

    const fullName = raw.fullName || '';
    if (!fullName) return null;

    const uniCode = raw.university || '';
    const university =
      UNIVERSITY_LABELS[uniCode] ?? (uniCode || 'University of Toronto');

    const program = raw.programOfStudy || '';

    const rawYear = raw.year ? Number(raw.year) : NaN;
    const year = Number.isNaN(rawYear) ? undefined : rawYear;

    const experiences = splitToList(raw.experiences);
    const awards = splitToList(raw.awards);
    const interests = [
      ...splitToList(raw.projects),
      ...splitToList(raw.skills),
    ];

    const residency_status: 'domestic' | 'international' = raw.isInternationalStudent
      ? 'international'
      : 'domestic';

    return {
      full_name: fullName,
      university,
      program,
      year,
      residency_status,
      experiences,
      interests,
      awards,
    };
  } catch (e) {
    console.error('Failed to parse userProfile from localStorage', e);
    return null;
  }
}

function labelForPriority(id: string): string {
  return id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function normalizeSelectedPriorities(
  all: PrioritySuggestion[],
  selectedNames: string[],
): { name: string; weight: number }[] {
  const selected = all.filter((p) => selectedNames.includes(p.name));
  if (selected.length === 0) return [];

  const total = selected.reduce(
    (sum, p) => sum + (typeof p.weight === 'number' ? p.weight : 0),
    0,
  );

  if (!total || total <= 0) {
    const equalWeight = 1 / selected.length;
    return selected.map((p) => ({ name: p.name, weight: equalWeight }));
  }

  return selected.map((p) => ({
    name: p.name,
    weight: p.weight / total,
  }));
}

// ---------- Page component ----------

export default function DraftPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [analysis, setAnalysis] = useState<ScholarshipAnalysis | null>(null);
  const [studentProfile, setStudentProfile] = useState<EssayStudentProfile | null>(
    null,
  );

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [draftContent, setDraftContent] = useState<string>('');
  const [winnerName, setWinnerName] = useState<string | null>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [notesToImprove, setNotesToImprove] = useState('');

  useEffect(() => {
    if (!id) return;

    // 1) Build profile from localStorage first
    const profile = buildEssayStudentProfile();
    if (!profile) {
      setPageError(
        'Please complete your profile first so we can personalize your essay.',
      );
      setPageLoading(false);
      return;
    }
    setStudentProfile(profile);

    // 2) Fetch scholarship + analysis
    const controller = new AbortController();

    async function load() {
      try {
        setPageLoading(true);
        setPageError(null);

        const [scholarRes, analysisRes] = await Promise.all([
          fetch(`${API_BASE}/api/scholarships/${id}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE}/api/scholarships/${id}/analysis`, {
            signal: controller.signal,
          }),
        ]);

        if (!scholarRes.ok) {
          throw new Error(`Scholarship HTTP ${scholarRes.status}`);
        }
        if (!analysisRes.ok) {
          throw new Error(`Analysis HTTP ${analysisRes.status}`);
        }

        const scholarshipData: Scholarship = await scholarRes.json();
        const analysisData: ScholarshipAnalysis = await analysisRes.json();

        setScholarship(scholarshipData);
        setAnalysis(analysisData);

        const names = (analysisData.priorities ?? []).map((p) => p.name);
        setSelectedPriorities(names);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Failed to load drafting data', err);
        setPageError('Unable to load drafting workspace right now.');
      } finally {
        setPageLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  const handleTogglePriority = (name: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleGenerateDraft = async () => {
    if (!analysis) {
      setGenerationError('Missing scholarship analysis. Try refreshing the page.');
      return;
    }
    if (!studentProfile) {
      setGenerationError('Missing profile. Please fill in your profile first.');
      return;
    }

    const normalized = normalizeSelectedPriorities(
      analysis.priorities ?? [],
      selectedPriorities,
    );
    if (normalized.length === 0) {
      setGenerationError(
        'Select at least one priority to focus on for this draft.',
      );
      return;
    }

    setGenerationError(null);
    setGenerating(true);

    try {
      const body = {
        scholarship_id: String(id),
        selected_priorities: normalized.map((p) => ({
          name: p.name,
          weight: p.weight,
        })),
        student_profile: studentProfile,
      };

      const res = await fetch(`${API_BASE}/api/essays/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: EssayResponse = await res.json();
      setDraftContent(data.essay);
      setWinnerName(data.winner_story_recipient_name || null);
    } catch (err: any) {
      console.error('Failed to generate essay draft', err);
      setGenerationError('Something went wrong while generating your draft.');
    } finally {
      setGenerating(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-7xl pt-24 text-center text-white">
        Setting up your drafting workspace…
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="mx-auto max-w-7xl pt-24 text-center text-white">
        <p className="mb-4 text-lg">{pageError}</p>
        <div className="flex justify-center gap-4 text-sm">
          <Link
            href="/profile"
            className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            Go to profile
          </Link>
          <Link
            href="/scholarships"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Back to scholarships
          </Link>
        </div>
      </div>
    );
  }

  const scholarshipTitle =
    scholarship?.name || analysis?.scholarship_title || 'Scholarship';

  const deadline =
    scholarship?.deadline && scholarship.deadline.trim().length > 0
      ? scholarship.deadline
      : 'Not listed';

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/scholarships/${id}`}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Scholarship Details
        </Link>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-400">
        Draft Workspace
      </p>

      <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">
        Personal Statement: {scholarshipTitle}
      </h1>

      {generationError && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {generationError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Draft editor */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header row */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                  <span className="font-semibold text-gray-800">
                    Focused weight profile:
                  </span>
                  {selectedPriorities.length > 0 ? (
                    selectedPriorities.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                      >
                        {labelForPriority(name)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No priorities selected yet.
                    </span>
                  )}
                </div>
                {winnerName && (
                  <p className="text-xs text-gray-500">
                    Style gently guided by a real success story from{' '}
                    <span className="font-medium">{winnerName}</span>.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={generating}
                className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
              >
                {generating ? 'Generating draft…' : 'Generate / Refresh draft'}
              </button>
            </div>

            {/* Draft content */}
            {draftContent ? (
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="min-h-[500px] w-full rounded-2xl border border-gray-300 bg-gray-50 p-6 text-sm text-gray-900 leading-relaxed focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            ) : (
              <div className="min-h-[260px] rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
                <p className="mb-3 font-medium text-gray-800">
                  No draft yet — click &ldquo;Generate / Refresh draft&rdquo; to
                  create your first version.
                </p>
                <p>
                  We’ll combine this scholarship’s hidden priorities with your
                  profile, then apply a style inspired by a real success story
                  so you have something concrete to edit instead of a blank
                  page.
                </p>
              </div>
            )}

            {/* Notes / “prove AI wrong” box */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                Notes for your next draft
              </p>
              <p className="mb-2 text-xs text-gray-600">
                If North Star AI is missing something important about you, write
                it here so you remember to add it in your edits or future
                drafts.
              </p>
              <textarea
                value={notesToImprove}
                onChange={(e) => setNotesToImprove(e.target.value)}
                placeholder="Prove North Star AI wrong about you. What else should this essay show?"
                className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={3}
              />
            </div>

            {/* Save button (local only for now) */}
            <button
              type="button"
              onClick={() => {
                try {
                  const stored = window.localStorage.getItem('northstar_drafts');
                  const existing = stored ? JSON.parse(stored) : {};
                  const key = `scholarship_${id}`;
                  const updated = {
                    ...existing,
                    [key]: {
                      draft: draftContent,
                      notes: notesToImprove,
                      updatedAt: new Date().toISOString(),
                    },
                  };
                  window.localStorage.setItem(
                    'northstar_drafts',
                    JSON.stringify(updated),
                  );
                  alert('Draft saved locally in your browser.');
                } catch (e) {
                  console.error('Failed to save draft locally', e);
                  alert('Could not save draft locally.');
                }
              }}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
            >
              Save draft (local)
            </button>
          </div>
        </div>

        {/* Right: priorities, strategies, profile recap */}
        <div className="space-y-4">
          {/* Scholarship + priorities */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Scholarship snapshot
            </h2>
            <p className="text-sm font-medium text-gray-900">
              {scholarshipTitle}
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">Value:</span>
                <span>{scholarship?.value || 'Variable / Not listed'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">Deadline:</span>
                <span>{deadline}</span>
              </div>
              {scholarship?.category && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700">Category:</span>
                  <span>{scholarship.category}</span>
                </div>
              )}
              {scholarship?.offered_by && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700">
                    Offered by:
                  </span>
                  <span>{scholarship.offered_by}</span>
                </div>
              )}
            </div>
          </div>

          {/* Priorities selector */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              Main priorities this scholarship cares about
            </h2>
            <p className="mb-3 text-xs text-gray-600">
              Toggle which ones you want this draft to emphasize. We’ll
              re-balance the weights behind the scenes.
            </p>

            <div className="mb-3 flex flex-wrap gap-2">
              {analysis?.priorities?.map((p) => {
                const active = selectedPriorities.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleTogglePriority(p.name)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border border-gray-300 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {labelForPriority(p.name)}
                  </button>
                );
              })}
            </div>

            {analysis?.priorities && analysis.priorities.length > 0 && (
              <ul className="space-y-1 text-xs text-gray-700">
                {analysis.priorities.map((p) => (
                  <li key={p.name}>
                    <span className="font-semibold">
                      {labelForPriority(p.name)}:
                    </span>{' '}
                    <span className="text-gray-600">
                      {p.reason || 'Important for this scholarship.'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Essay strategies */}
          {analysis?.essay_strategies && analysis.essay_strategies.length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Essay strategies suggested by AI
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
                {analysis.essay_strategies.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile recap */}
          {studentProfile && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Using your profile
              </h2>
              <p className="text-xs text-gray-700">
                <span className="font-semibold">{studentProfile.full_name}</span>
                {studentProfile.program && (
                  <>
                    {' '}
                    · {studentProfile.program}
                  </>
                )}
                {studentProfile.university && (
                  <>
                    {' '}
                    · {studentProfile.university}
                  </>
                )}
                {typeof studentProfile.year === 'number' && (
                  <>
                    {' '}
                    · Year {studentProfile.year}
                  </>
                )}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                We&apos;re pulling from your experiences, projects, awards, and skills
                — the more detail you give there, the better this draft gets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
