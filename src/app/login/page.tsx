"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user_id", "demo_user");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-white">TENNIS</span>
            <span className="text-3xl font-bold font-mono text-cyan-400">EDGE</span>
          </Link>
        </div>

        <div className="p-6 rounded-xl border border-cyan-500/30 bg-black/80 backdrop-blur-xl">
          <h2 className="text-2xl font-mono text-white text-center mb-6">ACCESS PLATFORM</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="email" placeholder="Email" required className="w-full h-12 px-4 rounded-lg border-2 border-cyan-500/30 bg-black/50 text-white font-mono placeholder:text-cyan-500/50 focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <input type="password" placeholder="Password" required className="w-full h-12 px-4 rounded-lg border-2 border-cyan-500/30 bg-black/50 text-white font-mono placeholder:text-cyan-500/50 focus:border-cyan-400 focus:outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold font-mono hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.5)] disabled:opacity-50">
              {loading ? "LOADING..." : "SIGN IN"}
            </button>
          </form>

          <p className="text-center text-cyan-400/40 text-sm font-mono mt-4">
            Demo: Enter any email/password
          </p>
        </div>
      </div>
    </main>
  );
}