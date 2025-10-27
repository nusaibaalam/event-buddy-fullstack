/* src/components/Logo.tsx */
"use client";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image src="/ticket.png" alt="Event buddy" width={22} height={22} />
      <span className="text-[18px] sm:text-[20px] font-semibold text-[#1b1361]">
        Event <span className="text-[#3b5cff]">buddy.</span>
      </span>
    </Link>
  );
}
