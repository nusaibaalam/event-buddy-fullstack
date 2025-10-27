// frontend/src/components/SearchBar.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");

  useEffect(() => setQ(sp.get("q") || ""), [sp]);

  const go = () => {
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mt-3 flex justify-center gap-3">
      <input
        aria-label="Search events"
        placeholder="Search events"
        className="w-[320px] sm:w-[420px] h-[44px] px-4 rounded-md bg-white/80 border border-white/70 shadow-sm focus:outline-none"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
      />
      <button
        className="h-[44px] px-5 rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] text-white shadow-md hover:opacity-95 transition"
        onClick={go}
      >
        Search Events
      </button>
    </div>
  );
}
