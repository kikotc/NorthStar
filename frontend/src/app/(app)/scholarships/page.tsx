'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

type Scholarship = {
  id: number | string;
  name: string;
  description?: string;
  value?: string | null;
  deadline?: string | null;
  category?: string | null;
  offered_by?: string | null;
  citizenship?: string | null;
};

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/scholarships/`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Scholarship[] = await res.json();

        // For now show all; later you can sort and slice for “top 10 matches”
        setScholarships(data);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Failed to load scholarships', err);
        setError('Unable to load scholarships.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center text-white">
        Loading scholarships...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-white">Scholarships</h1>

      {scholarships.map((s) => {
        const deadline =
          s.deadline && s.deadline.trim().length > 0
            ? s.deadline
            : 'Not listed';

        return (
          <div
            key={s.id}
            className="flex gap-8 justify-between rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">{s.name}</h2>

              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Value</span>
                  <span>{s.value || 'Variable / Not listed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Deadline</span>
                  <span>{deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Category</span>
                  <span>{s.category || 'Not listed'}</span>
                </div>
              </div>

              {s.description && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <Link
                href={`/scholarships/${s.id}`}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
