"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LineChart, BookOpen, Wallet, Settings, Activity, Menu, X, Database } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/bankroll", label: "Bankroll", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile Toggle */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/80 border border-cyan-500/30 text-cyan-400 lg:hidden">
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/90 border-r border-cyan-500/20 z-40 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-cyan-500/20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-lg font-bold font-mono text-white">TENNIS</span>
              <span className="text-lg font-bold font-mono text-cyan-400">EDGE</span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-cyan-400/60 hover:bg-cyan-500/10'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-mono text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Database Status */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400/70">Database Connected</span>
            <div className="w-2 h-2 rounded-full bg-green-400 ml-auto animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 border-t border-cyan-500/20 z-30">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${pathname === item.href ? 'text-cyan-400' : 'text-cyan-400/40'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-mono">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}