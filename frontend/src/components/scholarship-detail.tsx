type ScholarshipDetailProps = {
  name: string;
  amount: string;
  dueDate: string;
  description: string;
  tags: string[];
  status?: "draft" | "review" | "submitted";
};

const statusStyles: Record<
  NonNullable<ScholarshipDetailProps["status"]>,
  { label: string; className: string }
> = {
  draft: { label: "Drafting", className: "bg-amber-100/10 text-amber-200" },
  review: { label: "In Review", className: "bg-indigo-100/10 text-indigo-200" },
  submitted: { label: "Submitted", className: "bg-emerald-100/10 text-emerald-200" },
};

export function ScholarshipDetail({
  name,
  amount,
  dueDate,
  description,
  tags,
  status = "draft",
}: ScholarshipDetailProps) {
  const statusMeta = statusStyles[status];

  return (
    <article className="rounded-3xl border border-white/10 bg-[#120d2d]/80 p-5 shadow-[0_20px_60px_rgba(5,4,20,0.35)] transition hover:border-white/40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{amount}</p>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>
        <div className="text-right text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Due</p>
          <p className="text-base font-semibold text-emerald-200">{dueDate}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
            {tag}
          </span>
        ))}
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${statusMeta.className}`}>
          {statusMeta.label}
        </span>
      </div>
    </article>
  );
}
