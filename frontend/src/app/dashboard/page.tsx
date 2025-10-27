"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import { api } from "@/lib/http";

export default function UserDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Fetch user info
    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data)) // note: backend returns { user: {...} }
      .catch(() => setUser(null));

    // Fetch user bookings
    api
      .get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  const cancelBooking = async (id: string) => {
    const token = getToken();
    await api.delete(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f7f7ff]">
      {/* Header */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#1b1361]"
        >
          <Image src="/ticket.png" alt="Event buddy" width={22} height={22} />
          <span className="text-[18px] font-semibold">
            Event <span className="text-[#3b5cff]">buddy.</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#1b1361]">
            Hello, <b>{user?.name}</b>
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md bg-gradient-to-b from-[#f87171] to-[#ef4444] px-4 py-2 text-white shadow hover:opacity-95"
          >
            <Image src="/logout.png" alt="Logout" width={16} height={16} />
            Logout
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-6 pb-10">
        <h2 className="text-[#1b1361] font-semibold text-xl mb-2">Dashboard</h2>
        <p className="text-[#6a6791] mb-6">
          Welcome back, <b>{user?.name || "User"}</b>! Here you can manage your
          event registrations.
        </p>

        <h3 className="text-[#1b1361] font-medium mb-3">
          My Registered Events
        </h3>

        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No registered events yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#eef2ff] text-center rounded-md px-3 py-2">
                    <div className="text-[#3b5cff] font-bold text-lg">
                      {new Date(ev.event.date)
                        .toLocaleString("en-US", {
                          month: "short",
                        })
                        .toUpperCase()}
                    </div>
                    <div className="text-[#1b1361] font-bold text-xl">
                      {new Date(ev.event.date).getDate()}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1b1361]">
                      {ev.event.title}
                    </h4>
                    <p className="text-sm text-[#6a6791]">
                      {new Date(ev.event.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {ev.event.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => cancelBooking(ev.id)}
                  className="rounded-md bg-gradient-to-b from-[#f87171] to-[#ef4444] px-4 py-2 text-white text-sm shadow hover:opacity-95"
                >
                  Cancel registration
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-[#3b5cff] text-white text-sm rounded-md px-4 py-2 hover:opacity-95"
          >
            Browse more events
          </Link>
        </div>
      </section>

      {/* Footer */}
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
