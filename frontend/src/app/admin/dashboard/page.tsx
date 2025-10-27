"use client";

import Image from "next/image";
import Link from "next/link";
import EventModal from "@/components/EventModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { api } from "@/lib/http";

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          router.push("/dashboard"); // non-admin users go to user dashboard
          return;
        }

        // ✅ Fetch all events after verifying admin
        api
          .get("/events", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setEvents(res.data.items))
          .catch(() => setEvents([]));
      })
      .catch(() => router.push("/auth/signin"));
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/auth/signin");
  };

  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7ff]">
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
            Hello, <b>Admin</b>
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
        <h2 className="text-[#1b1361] font-semibold text-xl mb-2">
          Admin Dashboard
        </h2>
        <p className="text-[#6a6791] mb-6">
          Manage events, view registrations, and monitor your platform.
        </p>

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#1b1361] font-medium">Events Management</h3>
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-[#3b5cff] text-white text-sm rounded-md px-4 py-2 shadow hover:opacity-95"
          >
            Create Event
          </button>
        </div>

        <div className="bg-white shadow rounded-md overflow-hidden">
          <table className="w-full text-sm text-left text-[#1b1361]">
            <thead className="bg-[#eef2ff] text-[#3b5cff] font-semibold">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="py-3 px-4">{e.title}</td>
                  <td className="py-3 px-4">
                    {new Date(e.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">{e.location}</td>
                  <td className="py-3 px-4">
                    {e.capacity - (e.seatsLeft ?? 0)}/{e.capacity}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3 text-[#3b5cff]">
                    {/* 🖋 Edit Button */}
                    <button
                      onClick={() => {
                        setEditData(e);
                        setShowModal(true);
                      }}
                      className="hover:opacity-80"
                    >
                      <Image
                        src="/edit.png"
                        width={16}
                        height={16}
                        alt="Edit"
                      />
                    </button>

                    {/* 👁 View Button */}
                    <button
                      onClick={() => router.push(`/events/${e.id}`)}
                      className="hover:opacity-80"
                      title="View Event"
                    >
                      <Image src="/eye.png" width={16} height={16} alt="View" />
                    </button>

                    {/* 🗑 Delete Button */}
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="hover:opacity-80"
                      title="Delete Event"
                    >
                      <Image
                        src="/trash.png"
                        width={16}
                        height={16}
                        alt="Delete"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      <EventModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={() => {
          const token = getToken();
          api
            .get("/events", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setEvents(res.data.items));
        }}
      />
    </main>
  );
}
