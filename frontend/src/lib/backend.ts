const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export type Scholarship = {
  id: string | number;
  name: string;
  description?: string;
  deadline?: string | null;
  value?: string | null;
  category?: string | null;
};

// GET /api/scholarships
export async function listScholarships(): Promise<Scholarship[]> {
  const res = await fetch(`${API_BASE}/api/scholarships`);
  if (!res.ok) throw new Error("Failed to load scholarships");
  return res.json();
}

// GET /api/scholarships/:id
export async function getScholarship(id: string | number): Promise<Scholarship> {
  const res = await fetch(`${API_BASE}/api/scholarships/${id}`);
  if (!res.ok) throw new Error("Failed to load scholarship");
  return res.json();
}

// GET /api/scholarships/:id/analysis
export async function getScholarshipAnalysis(id: string | number) {
  const res = await fetch(`${API_BASE}/api/scholarships/${id}/analysis`);
  if (!res.ok) throw new Error("Failed to load analysis");
  return res.json();
}

type Priority = { id: string; label?: string; weight: number };

// POST /api/essays/generate
export async function generateEssay(payload: {
  scholarship_id: string | number;
  profile_summary: string;
  priorities: Priority[];
  target_length_words?: number;
  tone?: string;
}) {
  const res = await fetch(`${API_BASE}/api/essays/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to generate essay");
  return res.json(); // { scholarship_id, essay, priorities }
}