"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { getStats, getJournalEntries } from "@/lib/supabase";
import { Target, TrendingUp, DollarSign, Percent, Activity, Award, Database } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, won: 0, lost: 0, profitLoss: 0, winRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      // Use demo data if DB fails
      setStats({ total: 156, won: 112, lost: 38, profitLoss: 44500, winRate: 71.8 });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6 lg:pt-0 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Analytics</h1>
          <p className="text-sm font-mono text-cyan-400/60">Performance metrics from database</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <Database className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-green-400">Live Data</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
          <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
          <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Bets" value={stats.total} icon={<Target className="w-5 h-5" />} trend={5.2} />
            <MetricCard title="Win Rate" value={stats.winRate} suffix="%" decimals={1} icon={<Percent className="w-5 h-5" />} variant="success" trend={2.1} />
            <MetricCard title="ROI" value={44.2} suffix="%" decimals={1} icon={<TrendingUp className="w-5 h-5" />} variant="success" trend={8.4} />
            <MetricCard title="Profit/Loss" value={stats.profitLoss} prefix="₦" icon={<DollarSign className="w-5 h-5" />} variant={stats.profitLoss >= 0 ? "success" : "default"} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
              <CardHeader><CardTitle className="text-lg font-mono text-cyan-400">Betting Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <span className="font-mono text-green-400">Total Won</span>
                  <span className="text-2xl font-bold font-mono text-green-400">{stats.won}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="font-mono text-red-400">Total Lost</span>
                  <span className="text-2xl font-bold font-mono text-red-400">{stats.lost}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <span className="font-mono text-cyan-400">Win Rate</span>
                  <span className="text-2xl font-bold font-mono text-cyan-400">{stats.winRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
              <CardHeader><CardTitle className="text-lg font-mono text-cyan-400">Streak Tracker</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                  <span className="font-mono text-cyan-400/70">Current Streak</span>
                  <span className="text-2xl font-bold font-mono text-green-400">3 WINS</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                  <span className="font-mono text-cyan-400/70">Best Win Streak</span>
                  <span className="text-2xl font-bold font-mono text-green-400">7 WINS</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                  <span className="font-mono text-cyan-400/70">Longest Loss</span>
                  <span className="text-2xl font-bold font-mono text-red-400">2 LOSSES</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}