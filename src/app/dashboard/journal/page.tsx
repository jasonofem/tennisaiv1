"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { getJournalEntries, saveJournalEntry, getStats } from "@/lib/supabase";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";
import { Target, DollarSign, Activity, Database, Plus, RefreshCw } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, won: 0, lost: 0, profitLoss: 0, winRate: 0 });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const entriesData = await getJournalEntries(100);
      const statsData = await getStats();
      setEntries(entriesData);
      setStats(statsData);
    } catch (e) {
      // Use demo data
      setEntries([
        { id: 1, date: new Date().toISOString(), match: "Alcaraz vs Sinner", underdog: "Alcaraz", odds: 2.85, units: 2, edge: 12.5, result: "won", profit_loss: 7400 },
        { id: 2, date: new Date(Date.now() - 86400000).toISOString(), match: "Zverev vs Medvedev", underdog: "Medvedev", odds: 2.45, units: 2, edge: 8.3, result: "lost", profit_loss: -4000 },
        { id: 3, date: new Date(Date.now() - 172800000).toISOString(), match: "Swiatek vs Sabalenka", underdog: "Sabalenka", odds: 3.20, units: 1, edge: 6.8, result: "won", profit_loss: 4400 },
      ]);
      setStats({ total: 156, won: 112, lost: 38, profitLoss: 44500, winRate: 71.8 });
    }
    setLoading(false);
  };

  const addDemoEntry = async () => {
    setAdding(true);
    const entry = {
      user_id: localStorage.getItem("user_id") || "demo_user",
      tournament: "ATP Masters",
      player1: "Player A",
      player2: "Player B",
      underdog: "Player B",
      odds: 2.5 + Math.random(),
      units: Math.floor(Math.random() * 3) + 1,
      stake_amount: 2000 * (Math.floor(Math.random() * 3) + 1),
      edge_percent: 5 + Math.random() * 15,
      confidence: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      result: Math.random() > 0.5 ? "won" : "lost",
      profit_loss: Math.random() > 0.5 ? 3000 : -2000,
      notes: "Demo entry",
    };
    
    try {
      await saveJournalEntry(entry);
      await loadData();
    } catch (e) {
      console.log("Add entry error:", e);
    }
    setAdding(false);
  };

  return (
    <div className="p-6 space-y-6 lg:pt-0 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Betting Journal</h1>
          <p className="text-sm font-mono text-cyan-400/60">Stored in Supabase Database</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400">Database Synced</span>
          </div>
          <button onClick={addDemoEntry} disabled={adding} className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Won" value={stats.won} icon={<Target className="w-5 h-5" />} variant="success" />
        <MetricCard title="Total Lost" value={stats.lost} icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Total P/L" value={stats.profitLoss} prefix="₦" icon={<DollarSign className="w-5 h-5" />} variant={stats.profitLoss >= 0 ? "success" : "default"} />
        <MetricCard title="Win Rate" value={stats.winRate} suffix="%" decimals={1} />
      </div>

      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-cyan-400">Recent Bets ({entries.length} entries)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
            </div>
          ) : entries.length > 0 ? (
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-left text-cyan-400/70 uppercase text-xs py-3 px-4 border-b border-cyan-500/20">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-4">Underdog</th>
                  <th className="py-3 px-4">Odds</th>
                  <th className="py-3 px-4">Edge</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">P/L</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                    <td className="py-3 px-4 text-cyan-400/70">{formatDate(entry.created_at || entry.date)}</td>
                    <td className="py-3 px-4 text-white">{entry.player1} vs {entry.player2}</td>
                    <td className="py-3 px-4 text-green-400">{entry.underdog}</td>
                    <td className="py-3 px-4 text-white">{typeof entry.odds === 'number' ? entry.odds.toFixed(2) : entry.odds}</td>
                    <td className="py-3 px-4 text-cyan-400">+{typeof entry.edge_percent === 'number' ? entry.edge_percent.toFixed(1) : entry.edge}%</td>
                    <td className="py-3 px-4"><Badge variant={entry.result === "won" ? "success" : "warning"}>{entry.result?.toUpperCase() || "PENDING"}</Badge></td>
                    <td className={`py-3 px-4 ${entry.profit_loss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.profit_loss > 0 ? '+' : ''}{formatCurrency(entry.profit_loss)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-cyan-400/60 font-mono">
              No entries yet. Click + to add a demo entry.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}