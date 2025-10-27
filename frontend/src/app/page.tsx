/* eslint-disable @next/next/no-img-element */
/* src/app/page.tsx */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import { listEvents, EventItem } from "@/lib/events";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // query in URL -> local state, and kept in sync
  const [q, setQ] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  // pagination (independent for upcoming & previous)
  const [upPage, setUpPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);

  const pageSize = 6; // 3 cols × 2 rows (Upcoming)
  const prevPageSize = 3; // 3 cols × 1 row (Previous)

  const [upcoming, setUpcoming] = useState<{
    items: EventItem[];
    totalPages: number;
  }>({
    items: [],
    totalPages: 1,
  });
  const [previous, setPrevious] = useState<{
    items: EventItem[];
    totalPages: number;
  }>({
    items: [],
    totalPages: 1,
  });

  // --- SEARCH HANDLER (hero search) ---
  const handleSearch = (term: string) => {
    // update URL
    const url = new URL(window.location.href);
    if (term) url.searchParams.set("q", term);
    else url.searchParams.delete("q");
    url.searchParams.set("page", "1"); // optional: a single 'page' param for the main list
    router.push(url.pathname + "?" + url.searchParams.toString());

    // update local state so effects run immediately
    setQ(term);
    // reset paginations
    setUpPage(1);
    setPrevPage(1);
  };

  // --- LOADERS ---
  const loadUpcoming = async () => {
    const data = await listEvents({
      status: "upcoming",
      q,
      page: upPage,
      pageSize,
      sort: "date_asc",
    });
    setUpcoming({ items: data.items, totalPages: data.totalPages });
  };

  const loadPrevious = async () => {
    const data = await listEvents({
      status: "past",
      q,
      page: prevPage,
      pageSize: prevPageSize,
      sort: "date_desc",
    });
    setPrevious({ items: data.items, totalPages: data.totalPages });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUpcoming().catch((e) => console.error("Error loading upcoming:", e));
  }, [q, upPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrevious().catch((e) => console.error("Error loading previous:", e));
  }, [q, prevPage]);

  return (
    <main className="min-h-screen bg-[#f7f7ff]">
      {/* Hero (has the search input/button) */}
      <Hero onSearch={handleSearch} />

      {/* Upcoming Events */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <h2 className="text-[#1b1361] font-semibold mb-4 text-lg sm:text-xl">
          Upcoming Events
        </h2>

        {upcoming.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.items.map((ev) => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={upPage}
                totalPages={upcoming.totalPages}
                onPage={(p) => setUpPage(p)}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No upcoming events found.
          </p>
        )}
      </section>

      {/* Previous Events */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 pb-14">
        <h2 className="text-[#1b1361] font-semibold mb-4 text-lg sm:text-xl">
          Previous Events
        </h2>

        {previous.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previous.items.map((ev) => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={prevPage}
                totalPages={previous.totalPages}
                onPage={(p) => setPrevPage(p)}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No previous events found.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ececf6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[#1b1361]">
            <img src="/ticket.png" alt="Event Buddy" className="w-5 h-5" />
            <span className="font-semibold">Event</span>
            <span className="text-[#3b5cff] font-semibold">buddy.</span>
          </div>
          <nav className="text-[12px] text-[#6a6791] flex gap-4">
            <a href="/">Home</a>
            <a href="/auth/signin">Sign in</a>
            <a href="/auth/signup">Sign up</a>
            <a href="#">Privacy Policy</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
