"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function BookNowButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const next = `${pathname}?${sp.toString()}`;

  const onClick = () => {
    const token = getToken();
    if (!token) {
      router.push(`/auth/signin?next=${encodeURIComponent(next)}`);
      return;
    }

    alert("You are logged in. Implement booking flow next 😄");
  };

  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
    >
      Book Now
    </button>
  );
}
