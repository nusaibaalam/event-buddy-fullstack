"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/http";
import { setToken } from "@/lib/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      const { data: login } = await api.post("/auth/login", {
        email,
        password,
      });
      setToken(login.accessToken);
      const { data: user } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${login.accessToken}` },
      });

      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4ff]">
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="text-[#1b1361] font-semibold">
          Event <span className="text-[#3b5cff]">buddy.</span>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-md mx-auto mt-16 bg-white rounded-xl shadow-xl p-8"
      >
        <h1 className="text-xl font-semibold text-[#2b2574] mb-2">Sign Up</h1>
        <p className="text-sm mb-6">
          Already have an account?{" "}
          <a
            href={`/auth/signin?next=${encodeURIComponent(next)}`}
            className="text-[#6b63d9] underline"
          >
            Sign in
          </a>
        </p>

        {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

        <label className="block text-sm mb-1">Full Name</label>
        <input
          className="w-full border rounded-md h-10 px-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
        />

        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border rounded-md h-10 px-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter your email"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded-md h-10 px-3 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter your password"
        />

        <button
          disabled={loading}
          className="w-full h-11 rounded-md bg-gradient-to-b from-[#5d6bff] to-[#3b5cff] text-white shadow-md"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}
