"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken } from "@/lib/auth";
import { api } from "@/lib/http";
import { useState } from "react";

export default function BookNow({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    const token = getToken();
    if (!token) {
      // send to sign-in with return
      router.push(`/auth/signin?next=/events/${eventId}`);
      return;
    }
    try {
      setLoading(true);
      await api.post("/bookings", { eventId, seats: 1 }); // default 1 seat here
      alert("Booked!");
      router.refresh();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="px-5 py-3 rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] text-white shadow-md hover:opacity-95 transition"
    >
      {loading ? "Booking..." : "Book Now"}
    </button>
  );
}
