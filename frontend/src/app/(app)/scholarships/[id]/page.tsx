'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

type Priority = {
  name: string;
  weight: number;
  reason: string;
};

type ScholarshipAnalysis = {
  scholarship_id: string;
  scholarship_title: string;
  institution: string;
  priorities: Priority[];
  essay_strategies: string[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

const SCHOLARSHIP_CACHE_PREFIX = 'northstar_scholarship_';

function loadCachedScholarship(id: string): Scholarship | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(
      `${SCHOLARSHIP_CACHE_PREFIX}${id}`,
    );
    if (!raw) return null;
    return JSON.parse(raw) as Scholarship;
  } catch (e) {
    console.error('Failed to read scholarship cache', e);
    return null;
  }
}

function saveCachedScholarship(id: string, data: Scholarship) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      `${SCHOLARSHIP_CACHE_PREFIX}${id}`,
      JSON.stringify(data),
    );
  } catch (e) {
    console.error('Failed to write scholarship cache', e);
  }
}

export default function ScholarshipDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  // Single source of truth for scholarshipId: from the URL param
  const scholarshipId = id ?? '';

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<ScholarshipAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [expandedProfiles, setExpandedProfiles] = useState<
    Record<number, boolean>
  >({});
  const [selectedProfiles, setSelectedProfiles] = useState<Set<number>>(
    () => new Set(),
  );


  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function load() {
      setError(null);
      setAnalysis(null);
      setAnalysisError(null);
      setExpandedProfiles({});
      setSelectedProfiles(new Set());

      // 1) Try cache first – if found, show immediately (no loading flicker)
      const cached = loadCachedScholarship(String(id));
      if (cached) {
        setScholarship(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }

      // 2) Still fetch fresh data in the background
      try {
        // 1) base scholarship
        const res = await fetch(`${API_BASE}/api/scholarships/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Scholarship = await res.json();
        setScholarship(data);
        saveCachedScholarship(String(id), data);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Failed to load scholarship', err);
        setError('Failed to load scholarship');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  const toggleProfile = (index: number) => {
    setExpandedProfiles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleSelectProfile = (index: number) => {
    setSelectedProfiles((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        Loading scholarship...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        <h1 className="mb-4 text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="mb-6">{error}</p>
        <Link
          href="/scholarships"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Scholarships
        </Link>
      </div>
    );
  }

  // ✅ At this point loading is false and no error.
  // If scholarship is still null, treat it as "not found" but DON'T crash.
  if (!scholarship) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        <h1 className="mb-4 text-2xl font-semibold">Scholarship not found</h1>
        <Link
          href="/scholarships"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Scholarships
        </Link>
      </div>
    );
  }

  const deadline =
    scholarship.deadline && scholarship.deadline.trim().length > 0
      ? scholarship.deadline
      : 'Not listed';

  const weightProfiles =
    analysis?.priorities?.map((p) => ({
      title: p.name.replace(/_/g, ' '),
      percentage: Math.round(p.weight * 100),
      reasoning: p.reason,
    })) ?? [];

const handleGoToDraft = () => {
  // If somehow we still don't have a valid ID, just don't navigate
  if (!scholarshipId) {
    console.error('Scholarship ID missing, cannot navigate to draft page');
    return;
  }

  try {
    if (typeof window !== 'undefined' && analysis?.priorities) {
      // If nothing explicitly selected, treat as "all selected"
      const indices =
        selectedProfiles.size > 0
          ? Array.from(selectedProfiles)
          : analysis.priorities.map((_, idx) => idx);

      const names = indices
        .filter((i) => i >= 0 && i < analysis.priorities.length)
        .map((i) => analysis.priorities[i].name);

      window.localStorage.setItem(
        `northstar_selected_priorities_${scholarshipId}`,
        JSON.stringify(names),
      );
    }
  } catch (e) {
    console.error('Failed to save selected priorities', e);
  }

  router.push(`/scholarships/${scholarshipId}/draft`);
};


  return (
    <div className="mx-auto max-w-6xl space-y-6 pt-10">
      <div className="mb-4">
        <Link
          href="/scholarships"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Scholarships
        </Link>
      </div>

      {/* MAIN GRID: left info, right AI priorities */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: scholarship info */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              {scholarship.name}
            </h1>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Value</span>
                  <span>{scholarship.value || 'Variable / Not listed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Deadline</span>
                  <span>{deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Category</span>
                  <span>{scholarship.category || 'Not listed'}</span>
                </div>
                {scholarship.offered_by && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Offered by</span>
                    <span>{scholarship.offered_by}</span>
                  </div>
                )}
                {scholarship.citizenship && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Citizenship</span>
                    <span>{scholarship.citizenship}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {scholarship.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI-generated weight profiles */}
        <div className="space-y-3">
          {analysisError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {analysisError}
            </div>
          )}

          {weightProfiles.length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                AI-generated weight profiles
              </h2>

              <div className="space-y-3">
                {weightProfiles.map((profile, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSelectProfile(index)}
                    className={`cursor-pointer rounded-2xl border p-3 transition ${
                      selectedProfiles.has(index)
                        ? 'border-indigo-500 bg-indigo-100/70 shadow-md'
                        : 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-300'
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.has(index)}
                          onChange={() => toggleSelectProfile(index)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <h3 className="text-sm font-semibold text-gray-900">
                          {profile.title}
                        </h3>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
                        {profile.percentage}%
                      </span>
                    </div>
                    <p
                      className={`text-xs text-gray-600 leading-relaxed ${
                        expandedProfiles[index] ? '' : 'line-clamp-2'
                      }`}
                    >
                      <span className="font-semibold">Reasoning:</span>{' '}
                      {profile.reasoning}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProfile(index);
                      }}
                      className="mt-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                    >
                      {expandedProfiles[index] ? 'Read Less' : 'Read More →'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-gray-700">
                <span className="font-semibold text-indigo-600">Tip:</span>{' '}
                Select one or more weight profiles to keep in mind when
                drafting your essay with North Star.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA to drafting workspace */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Ready to start your essay for this scholarship?
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          North Star AI will analyze this scholarship’s hidden priorities, combine
          them with your profile, and generate a first draft you can edit and refine.
        </p>
        <button
          type="button"
          onClick={handleGoToDraft}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
        >
          Go to drafting workspace
        </button>
      </div>
    </div>
  );
}
