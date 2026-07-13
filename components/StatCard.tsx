type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
};

const toneClass = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700"
};

export function StatCard({ label, value, helper, tone = "slate" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <p className="text-sm text-muted">{label}</p>
      <div
        className={`mt-3 inline-flex min-h-10 min-w-16 items-center justify-center rounded-md border px-3 py-2 text-2xl font-bold ${toneClass[tone]}`}
      >
        {value}
      </div>
      {helper && <p className="mt-3 text-xs leading-5 text-muted">{helper}</p>}
    </div>
  );
}
