/* eslint-disable @next/next/no-img-element */
/* src/components/EventCard.tsx */
"use client";
import Link from "next/link";
import Image from "next/image";
import type { EventItem } from "@/lib/events";

export default function EventCard({ ev }: { ev: EventItem }) {
  const img = "/event.jpg";
  const date = new Date(ev.date);

  const hh = date.getHours();
  const end = (hh + 2) % 24;
  const fmt = (n: number) => `${((n + 11) % 12) + 1} ${n >= 12 ? "PM" : "AM"}`;
  const timeRange = `${fmt(hh)} – ${fmt(end)}`;

  return (
    <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(31,38,135,0.12)] overflow-hidden">
      {/* Clickable image opens details */}
      <Link href={`/events/${ev.id}`}>
        <img src={img} alt={ev.title} className="w-full h-56 object-cover" />
      </Link>

      <div className="p-6">
        <div className="text-[#6b63d9] text-sm font-semibold mb-1">
          {new Date(ev.date).toLocaleString()}
        </div>

        {/* Clicking title also opens details */}
        <Link
          href={`/events/${ev.id}`}
          className="block text-xl font-semibold text-[#1b1361] hover:underline"
        >
          {ev.title}
        </Link>

        <p className="text-sm text-[#4b3f97]/90 mt-2 line-clamp-2">
          {ev.description}
        </p>

        {/* meta */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[#4f4a87]">
          <div className="inline-flex items-center gap-1">
            <span className="i">🗓️</span> Sunday
          </div>
          <div className="inline-flex items-center gap-1 justify-center">
            <span className="i">⏱️</span> {timeRange}
          </div>
          <div className="inline-flex items-center gap-1 justify-end">
            <span className="i">📍</span> {ev.location}
          </div>
        </div>

        {/* tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Tech", "Conference", "AI"].map((t) => (
            <span
              key={t}
              className="px-2 py-[3px] rounded-md text-[11px] bg-[#eef0ff] text-[#3b4bff] font-medium"
            >
              {t}
            </span>
          ))}
        </div>

        {/* footer */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-[#6a6791]">
          <div className="inline-flex items-center gap-2">
            <span className="i">👥</span> {ev.seatsLeft} Spots Left
          </div>
          <div className="text-[#6a6791]">Total {ev.capacity} Seats</div>
        </div>

        <div className="mt-5 flex justify-end">
          <Link
            href={`/events/${ev.id}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
