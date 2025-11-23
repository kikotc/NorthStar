'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const id = params?.id;

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function load() {
      setError(null);

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

  const scholarshipId = String(scholarship.id ?? id);

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

      {/* CTA to go to drafting workspace */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Ready to start your essay for this scholarship?
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          North Star AI will analyze this scholarship’s hidden priorities, combine
          them with your profile, and generate a first draft you can edit and refine.
        </p>
        <Link
          href={`/scholarships/${scholarshipId}/draft`}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
        >
          Go to drafting workspace
        </Link>
      </div>
    </div>
  );
}
