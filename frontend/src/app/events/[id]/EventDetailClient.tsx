"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";
import { getToken } from "@/lib/auth";
import type { EventItem } from "@/lib/events";

export default function EventDetailClient({ event }: { event: EventItem }) {
  const router = useRouter();

  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const bookNow = async () => {
    const token = getToken();
    if (!token) {
      router.push(
        `/auth/signin?next=${encodeURIComponent(`/events/${event.id}`)}`
      );
      return;
    }
    try {
      setErr(null);
      setLoading(true);
      const { data: user } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const date = new Date(event.date);
  const isPastEvent = date < new Date();

  const prettyDate = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const prettyTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const img = "/event.jpg";

  return (
    <main className="min-h-screen bg-[#f7f7ff]">
      {/* Top bar */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#1b1361]"
        >
          <Image src="/ticket.png" alt="Event buddy" width={20} height={20} />
          <span className="font-semibold">Event</span>
          <span className="text-[#3b5cff] font-semibold">buddy.</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          {getToken() ? (
            <>
              <Link
                href="/"
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Back link */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#4b3f97] text-sm hover:underline"
        >
          <Image src="/arrow-left.png" alt="" width={18} height={18} />
          Back to event
        </Link>
      </div>

      {/* Hero image */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 mt-3">
        <div className="relative w-full overflow-hidden rounded-lg bg-white shadow">
          <img
            src={img}
            alt={event.title}
            className="w-full h-[320px] sm:h-[420px] object-cover"
          />
        </div>
      </div>

      {/* Title + badges */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {Array.isArray(event.tags) &&
            (event.tags as any[]).slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="inline-block rounded bg-[#eef2ff] text-[#4b3f97] text-[11px] px-2 py-1"
              >
                {String(t)}
              </span>
            ))}
        </div>

        <h1 className="text-[20px] sm:text-[22px] text-[#1b1361] font-semibold">
          {event.title}
        </h1>

        {/* Date / Time / Location row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard icon={<CalendarIcon />} label="Date" value={prettyDate} />
          <InfoCard icon={<ClockIcon />} label="Time" value={`${prettyTime}`} />
          <InfoCard
            icon={<PinIcon />}
            label="Location"
            value={event.location}
          />
        </div>
      </section>

      {/* Seat selector */}
      {!isPastEvent ? (
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6">
          <div className="rounded-lg bg-white shadow p-5">
            <p className="text-[13px] text-[#6a6791] mb-3">
              Select Number of Seats
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setSeats(n)}
                  className={[
                    "h-20 rounded-md border text-center text-[12px] shadow-sm",
                    seats === n
                      ? "border-[#3b5cff] bg-[#eef2ff] text-[#3b5cff]"
                      : "border-[#e6e7f4] bg-white text-[#6a6791]",
                  ].join(" ")}
                >
                  <div className="mt-2 flex justify-center">
                    <Image src="/ticket.png" alt="" width={18} height={18} />
                  </div>
                  <div className="mt-1 text-[18px] font-semibold">{n}</div>
                  <div className="text-[11px]">Seat{n > 1 ? "s" : ""}</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
              <button
                onClick={bookNow}
                disabled={loading}
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95 disabled:opacity-70"
              >
                {loading
                  ? "Booking…"
                  : `Book ${seats} Seat${seats > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6">
          <div className="rounded-lg bg-gray-100 shadow p-5 text-center">
            <p className="text-[#6a6791] text-sm font-medium">
              This event has already passed. Booking is closed.
            </p>
          </div>
        </section>
      )}

      {/* About */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 pb-10">
        <h3 className="text-[#1b1361] font-semibold mb-2">About this event</h3>
        <p className="text-[13px] leading-6 text-[#6a6791] whitespace-pre-line">
          {event.description ||
            "Details coming soon. Join us for an immersive one-day technology event bringing together developers, startups, and industry leaders to explore the future of software."}
        </p>
      </section>

      {/* Spots & footer */}
      <div className="border-t border-[#ececf6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 text-[13px] text-[#4b3f97] flex items-center gap-3">
          <Image src="/eye.png" width={18} height={18} alt="" />
          <span className="mr-2">{event.seatsLeft} Spots Left</span>
          <span className="text-[#9aa0b6]">(Total {event.capacity} seats)</span>
        </div>
      </div>

      <footer className="border-t border-[#ececf6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[#1b1361]">
            <Image src="/ticket.png" alt="Event Buddy" width={20} height={20} />
            <span className="font-semibold">Event</span>
            <span className="text-[#3b5cff] font-semibold">buddy.</span>
          </div>
          <nav className="text-[12px] text-[#6a6791] flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/auth/signin">Sign in</Link>
            <Link href="/auth/signup">Sign up</Link>
            <a href="#">Privacy Policy</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

/** small UI helpers */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white shadow p-4 flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-[11px] text-[#9aa0b6]">{label}</div>
        <div className="text-[13px] text-[#1b1361]">{value}</div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 2v3M17 2v3M4 8h16M5 12h14M5 16h10"
        stroke="#3b5cff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7v5l4 2"
        stroke="#3b5cff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="#3b5cff" strokeWidth="1.7" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="#3b5cff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="10" r="2.5" fill="#3b5cff" />
    </svg>
  );
}
