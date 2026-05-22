import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="relative text-center space-y-6">
          <div className="text-6xl md:text-8xl font-black font-mono">
            <span className="text-white">TENNIS</span>
            <span className="text-cyan-400">EDGE</span>
          </div>
          <p className="text-2xl font-mono text-cyan-400">Precision. Discipline. Edge.</p>
          <p className="text-cyan-400/60 font-mono max-w-md mx-auto">
            Professional tennis betting intelligence. Maximum 3 high-value underdog opportunities daily.
          </p>
          <Link href="/login" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold font-mono text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,240,255,0.5)]">
            ACCESS PLATFORM
          </Link>
        </div>
      </div>
    </main>
  );
}