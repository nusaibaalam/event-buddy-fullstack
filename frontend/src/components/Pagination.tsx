"use client";
type Props = {
  page: number;
  totalPages: number; // pass 68
  onChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  // helper to render compact range like: 1, 2, 3, …, 67, 68
  const makePages = () => {
    const pages: (number | "dots")[] = [];
    const push = (v: number | "dots") => pages.push(v);

    // always show first two and last two
    const left = [1, 2];
    const right = [totalPages - 1, totalPages];

    const near = [page - 1, page, page + 1].filter(
      (n) => n > 2 && n < totalPages - 1
    );

    // merge unique, sorted
    const set = new Set<number>(
      [...left, ...near, ...right].filter((n) => n >= 1 && n <= totalPages)
    );
    const arr = Array.from(set).sort((a, b) => a - b);

    for (let i = 0; i < arr.length; i++) {
      const cur = arr[i];
      const prev = arr[i - 1];

      if (i && prev! + 1 !== cur) push("dots");
      push(cur);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex items-center gap-2">
      {makePages().map((p, i) =>
        p === "dots" ? (
          <span key={`d-${i}`} className="px-2 text-[#7B80B7] select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              "h-8 w-8 rounded-md text-sm font-semibold",
              p === page
                ? "bg-[#3E48DE] text-white shadow-[0_6px_18px_-6px_rgba(62,72,222,0.6)]"
                : "bg-[#EEF0FF] text-[#3A3F77] hover:bg-[#E6E8FF]",
            ].join(" ")}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
}
