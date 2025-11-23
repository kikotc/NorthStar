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
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/scholarships/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setScholarship(data);
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

  if (error || !scholarship) {
    return (
      <div className="mx-auto max-w-6xl pt-24 text-center text-white">
        <h1 className="text-2xl font-semibold mb-4">Scholarship not found</h1>
        <Link
          href="/scholarships"
          className="text-indigo-400 hover:text-indigo-300 font-medium"
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

      {/* Placeholder right-hand column for future AI weights / drafts */}
      {/* For now, this keeps the layout flexible without blocking you. */}
    </div>
  );
}
