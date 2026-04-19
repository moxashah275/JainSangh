import { SlidersHorizontal, X } from "lucide-react";

export default function FilterBar({
  filters,
  options,
  onChange,
  onClear,
  className = "",
}) {
  const hasActive = Object.values(filters || {}).some(
    (v) => v && v !== "All" && v !== "",
  );

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-slate-600 shrink-0 border border-slate-200">
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
          <span className="text- font-bold uppercase tracking-[0.18em]">
            Filters
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {(options || []).map((opt) => (
            <select
              key={opt.key}
              value={filters?.[opt.key] || ""}
              onChange={(e) => onChange(opt.key, e.target.value)}
              className="min-w-[140px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 font-semibold focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all cursor-pointer hover:border-teal-400 shadow-sm"
            >
              <option value="">{opt.placeholder}</option>
              {(opt.items || []).map((item) => {
                const val = typeof item === "string" ? item : item.value;
                const label = typeof item === "string" ? item : item.label;
                return (
                  <option key={val} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
          ))}

          {hasActive && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text- font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
