'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

type UserProfilePayload = {
  full_name: string;
  university: string;
  program: string;
  year: number;
  residency_status: 'domestic' | 'international';
  ethnicities: string[];

  experiences: string[];
  interests: string[];
  awards: string[];
  skills: string[];
};

type MatchedScholarship = {
  id: string;
  title: string;
  value?: string | null;
  deadline?: string | null;
  level_of_study?: string | null;
  legal_status?: string | null;
  description?: string | null;
  match_percentage: number;
  reason?: string | null;
};

type MatchResponse = {
  matches?: MatchedScholarship[];
  scholarships?: MatchedScholarship[]; // safety if backend uses old shape
};

type ProfilePayloadResult = {
  payload: UserProfilePayload;
  completedAt?: string;
};

type MatchesCache = {
  profileCompletedAt?: string;
  matches: MatchedScholarship[];
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

function buildProfilePayload(): ProfilePayloadResult | null {
  if (typeof window === 'undefined') return null;

  const rawJson = window.localStorage.getItem('userProfile');
  if (!rawJson) return null;

  try {
    const raw = JSON.parse(rawJson);

    const experiences = splitToList(raw.experiences);
    const awards = splitToList(raw.awards);
    const projects = splitToList(raw.projects);
    const skillsText = splitToList(raw.skills);
    const combinedSkills = [...skillsText, ...projects].filter(Boolean);

    const payload: UserProfilePayload = {
      full_name: raw.fullName || '',
      university: raw.university || '',
      program: raw.programOfStudy || '',
      year: Number(raw.year ?? 1),
      residency_status: raw.isInternationalStudent ? 'international' : 'domestic',
      ethnicities: Array.isArray(raw.ethnicities) ? raw.ethnicities : [],

      experiences,
      interests: [], // wire up later if you add to the form
      awards,
      skills: combinedSkills,
    };

    // Basic sanity check: if core fields are missing, treat as incomplete
    if (!payload.full_name || !payload.university || !payload.program || !payload.year) {
      return null;
    }

    return {
      payload,
      completedAt: raw.completedAt,
    };
  } catch (e) {
    console.error('Failed to parse userProfile from localStorage', e);
    return null;
  }
}

function loadMatchesCache(profileCompletedAt?: string): MatchedScholarship[] | null {
  if (typeof window === 'undefined' || !profileCompletedAt) return null;

  const raw = window.localStorage.getItem('northstarMatches');
  if (!raw) return null;

  try {
    const parsed: MatchesCache = JSON.parse(raw);
    if (
      parsed.profileCompletedAt === profileCompletedAt &&
      Array.isArray(parsed.matches)
    ) {
      return parsed.matches;
    }
  } catch (e) {
    console.error('Failed to parse matches cache', e);
  }

  return null;
}

function saveMatchesCache(
  profileCompletedAt: string | undefined,
  matches: MatchedScholarship[],
) {
  if (typeof window === 'undefined' || !profileCompletedAt) return;

  const payload: MatchesCache = {
    profileCompletedAt,
    matches,
  };

  try {
    window.localStorage.setItem('northstarMatches', JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save matches cache', e);
  }
}

function matchLabel(p: number): string {
  if (p >= 70) return 'Strong Match';
  if (p >= 40) return 'Good Match';
  return 'Possible Match';
}

export default function ScholarshipsPage() {
  // null = not loaded yet; [] = loaded but no matches
  const [matches, setMatches] = useState<MatchedScholarship[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profileResult = buildProfilePayload();

    if (!profileResult) {
      setError(
        'Please complete your profile first so we can match scholarships to you.',
      );
      setLoading(false);
      return;
    }

    const { payload, completedAt } = profileResult;

    // 1) Try cache first
    const cached = loadMatchesCache(completedAt);
    if (cached && cached.length > 0) {
      setMatches(cached.slice(0, 5));
      setLoading(false);
      return;
    }

    // 2) Otherwise call backend
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/scholarships/match`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: MatchResponse = await res.json();
        console.log('match api raw response', data);

        const serverMatches =
          (data.matches ?? data.scholarships ?? []) as MatchedScholarship[];

        const topFive = serverMatches.slice(0, 5);
        setMatches(topFive);
        saveMatchesCache(completedAt, topFive);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Failed to load scholarship matches', err);
        setError('Unable to load scholarship matches right now.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // If we are still loading (or matches haven't been set yet), show loading
  if (loading && !error) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        Loading your top scholarship matches…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        <p className="mb-4 text-lg">{error}</p>
        <Link
          href="/profile"
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Go back to profile
        </Link>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        <p className="mb-2 text-lg">No matches yet.</p>
        <p className="text-sm text-slate-300">
          Try adding more detail about your experiences, projects, awards, and skills.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pt-10">
      <h1 className="text-3xl font-bold text-white mb-4">Scholarships</h1>

      <p className="mb-6 text-sm text-slate-300">
        These are your top {Math.min(matches.length, 5)} matches based on your profile.
      </p>

      <div className="space-y-6">
        {matches.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-stretch"
          >
            {/* Left: scholarship details */}
            <div className="flex-1 space-y-3 text-sm text-gray-800">
              <h2 className="text-xl font-semibold text-gray-900">
                {s.title}
              </h2>

              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="font-semibold">💰 Value</span>
                  <span>{s.value || 'Not listed'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">⏰ Deadline</span>
                  <span>{s.deadline || 'Not listed'}</span>
                </div>
                {s.level_of_study && (
                  <div className="flex gap-2">
                    <span className="font-semibold">🎓 Level of Study</span>
                    <span>{s.level_of_study}</span>
                  </div>
                )}
                {s.legal_status && (
                  <div className="flex gap-2">
                    <span className="font-semibold">📜 Legal Status</span>
                    <span>{s.legal_status}</span>
                  </div>
                )}
              </div>

              {s.description && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-900 mb-1">
                    Description
                  </p>
                  <p className="text-xs leading-relaxed text-gray-700 line-clamp-4">
                    {s.description}
                  </p>
                </div>
              )}

              {s.reason && (
                <p className="pt-2 text-xs text-indigo-700">
                  Why this match: {s.reason}
                </p>
              )}
            </div>

            {/* Right: match percentage + button */}
            <div className="flex w-full flex-col items-center justify-between gap-4 md:w-48">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50 px-6 py-4">
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.round(s.match_percentage)}%
                </div>
                <div className="text-xs font-medium text-indigo-800 mt-1">
                  {matchLabel(s.match_percentage)}
                </div>
              </div>

              <Link
                href={`/scholarships/${s.id}`}
                className="w-full rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
