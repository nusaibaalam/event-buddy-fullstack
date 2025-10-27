"use client";

export default function StatusTabs({
  value,
  onChange,
}: {
  value: "upcoming" | "past" | "all";
  onChange: (v: "upcoming" | "past" | "all") => void;
}) {
  const opts: Array<["upcoming" | "past" | "all", string]> = [
    ["upcoming", "Upcoming"],
    ["past", "Past"],
    ["all", "All"],
  ];

  return (
    <div className="inline-flex rounded-xl bg-white/80 border border-slate-200 p-1">
      {opts.map(([k, label]) => {
        const active = value === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              active
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
