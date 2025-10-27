"use client";

import Link from "next/link";
import Image from "next/image";
import { getToken, clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    setLoggedIn(!!getToken());
  }, []);

  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#1b1361]"
        >
          <Image src="/ticket.png" alt="Event buddy" width={22} height={22} />
          <span className="text-[18px] sm:text-[20px] font-semibold">
            Event <span className="text-[#3b5cff]">buddy.</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          {!loggedIn ? (
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
          ) : (
            <>
              <Link
                href="/dashboard"
                className="rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] px-4 py-2 text-white shadow hover:opacity-95"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-gradient-to-b from-[#f87171] to-[#ef4444] px-4 py-2 text-white shadow hover:opacity-95"
              >
                <Image src="/logout.png" alt="Logout" width={18} height={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
