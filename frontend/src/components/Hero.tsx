/* src/components/Hero.tsx */
"use client";
import Image from "next/image";
import Header from "@/components/Header";

export default function Hero({ onSearch }: { onSearch?: (q: string) => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* BG */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-10 sm:pt-12 pb-12 sm:pb-16">
        {/* top bar */}
        <Header />

        {/* tickets left/right */}
        <Image
          src="/left-ticket.jpg"
          alt=""
          width={360}
          height={160}
          priority
          className="
            pointer-events-none select-none absolute
            -left-24 top-[110px]
            sm:-left-16 sm:top-[120px]
            lg:-left-10 lg:top-[130px]
            w-[280px] sm:w-[320px] lg:w-[360px]
            rotate-[-8deg]
            drop-shadow-[0_25px_50px_rgba(62,72,222,0.25)]
          "
        />

        <Image
          src="/right-ticket.jpg"
          alt=""
          width={320}
          height={150}
          priority
          className="
            pointer-events-none select-none absolute
            -right-24 top-[110px]
            sm:-right-16 sm:top-[120px]
            lg:-right-10 lg:top-[130px]
            w-[260px] sm:w-[280px] lg:w-[320px]
            rotate-[10deg]
            drop-shadow-[0_25px_50px_rgba(62,72,222,0.25)]
          "
        />

        {/* Title block */}
        <div className="relative text-center mt-10 sm:mt-14">
          <h1 className="text-[#3b2bb7] font-bold leading-tight">
            <span className="block text-[44px] sm:text-[64px]">Discover</span>
            <span className="block text-[44px] sm:text-[64px]">
              <span className="text-[#5d6bff]">Amazing</span>{" "}
              <span className="text-[#3b2bb7]">Events</span>
            </span>
          </h1>

          <p className="mt-4 text-[#4b3f97]/90 text-sm sm:text-base">
            Find and book events that match your interests. From tech
            conferences to music festivals, we’ve got you covered.
          </p>

          <p className="mt-8 text-[#1b1361] font-semibold">
            Find Your Next Event
          </p>

          {/* search */}
          <div className="mt-3 flex justify-center gap-3">
            <input
              aria-label="Search events"
              placeholder="Search events"
              className="w-[320px] sm:w-[420px] h-[44px] px-4 rounded-md bg-white/80 border border-white/70 shadow-sm focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && onSearch) {
                  onSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              className="h-[44px] px-5 rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] text-white shadow-md hover:opacity-95 transition"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  'input[aria-label="Search events"]'
                );
                if (el && onSearch) onSearch(el.value);
              }}
            >
              Search Events
            </button>
          </div>
        </div>
      </div>

      {/* soft radial backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_center,rgba(93,107,255,0.18),transparent_60%)]"
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/60" />
    </section>
  );
}
