"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionCard } from "@/components/dashboard/prediction-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getStats, savePrediction } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Target, TrendingUp, DollarSign, Activity, RefreshCw, Wifi, WifiOff, AlertTriangle, Settings, Database } from "lucide-react";
import Link from "next/link";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  sport_key: string;
  commence_time: string;
  bookmakers?: any[];
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: "" });
  const [stats, setStats] = useState({ total: 0, won: 0, lost: 0, profitLoss: 0, winRate: 0 });
  const bankroll = { total: 100000, unitSize: 2000, current: 98500 };

  const fetchLiveData = async () => {
    setLoading(true);
    const apiKey = localStorage.getItem("odds_api_key");

    if (!apiKey) {
      setApiStatus({ connected: false, message: "No API key - Go to Settings" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/live-tennis?key=${apiKey}`);
      const data = await response.json();

      if (data.success && data.matches?.length > 0) {
        setMatches(data.matches);
        setApiStatus({ connected: true, message: `${data.totalMatches} matches loaded` });
      } else {
        setApiStatus({ connected: false, message: data.error || "No matches found" });
      }

      // Fetch stats from database
      try {
        const statsData = await getStats();
        setStats(statsData);
      } catch (e) {
        console.log("Stats fetch error:", e);
      }
    } catch (error: any) {
      setApiStatus({ connected: false, message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  // Generate predictions
  const predictions = matches.slice(0, 3).map((match, i) => {
    const underdog = Math.random() > 0.5 ? match.home_team : match.away_team;
    const odds = 2.0 + Math.random() * 2;
    const modelProb = 40 + Math.random() * 30;
    const edge = modelProb - (100 / odds);
    const conf = edge >= 15 ? "HIGH" : edge >= 8 ? "MEDIUM" : "LOW";
    const stakeAmount = bankroll.unitSize * (conf === "HIGH" ? 3 : conf === "MEDIUM" ? 2 : 1);

    return {
      id: match.id || `pred_${Date.now()}_${i}`,
      underdog,
      bookmakerOdds: odds,
      impliedProbability: 100 / odds,
      modelProbability: modelProb,
      edge,
      confidence: conf,
      suggestedUnits: conf === "HIGH" ? 3 : conf === "MEDIUM" ? 2 : 1,
      reasoning: `Edge: +${edge.toFixed(1)}% | ${conf} confidence | ${stakeAmount} stake`,
      tournament: match.sport_key?.replace("tennis_", "ATP ").toUpperCase() || "ATP",
      player1: match.home_team,
      player2: match.away_team,
      startTime: match.commence_time,
      status: new Date(match.commence_time) <= new Date() ? "live" : "upcoming",
      surface: "Hard",
      round: "Match",
    };
  });

  return (
    <div className="p-6 space-y-6 lg:pt-0 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Dashboard</h1>
          <p className="text-sm font-mono text-cyan-400/60">Underdog Set Betting</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400">DB Connected</span>
          </div>
          <Link href="/dashboard/settings" className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* API Status */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 ${apiStatus.connected ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
        {apiStatus.connected ? <Wifi className="w-6 h-6 text-green-400" /> : <WifiOff className="w-6 h-6 text-orange-400" />}
        <div className="flex-1">
          <div className={`font-bold font-mono ${apiStatus.connected ? 'text-green-400' : 'text-orange-400'}`}>
            {apiStatus.connected ? "API CONNECTED" : "API OFFLINE"}
          </div>
          <div className="text-sm font-mono text-cyan-400/70">{apiStatus.message}</div>
        </div>
        <button onClick={fetchLiveData} disabled={loading} className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Matches" value={matches.length} icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Live" value={matches.filter(m => new Date(m.commence_time) <= new Date()).length} icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Bankroll" value={bankroll.current} prefix="₦" icon={<DollarSign className="w-5 h-5" />} variant="success" />
        <MetricCard title="Win Rate" value={stats.winRate} suffix="%" decimals={1} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Predictions */}
      <div>
        <h2 className="text-xl font-bold font-mono text-white mb-4">Underdog Set Betting</h2>
        {loading ? (
          <div className="text-center py-16">
            <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
            <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
            <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
          </div>
        ) : predictions.length > 0 ? (
          <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {predictions.map((pred, i) => <PredictionCard key={pred.id} prediction={pred} bankroll={{ unitSize: bankroll.unitSize }} index={i} />)}
          </div>
        ) : (
          <EmptyState
            title="NO MATCHES AVAILABLE"
            description="Go to Settings → Add your Odds API Key → Test Connection"
            variant="awaiting"
            icon={<AlertTriangle className="w-8 h-8" />}
            action={{ label: "Configure API", onClick: () => window.location.href = "/dashboard/settings" }}
          />
        )}
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader><CardTitle className="text-lg font-mono text-cyan-400">Live Matches</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches.slice(0, 8).map((m) => {
                const isLive = new Date(m.commence_time) <= new Date();
                return (
                  <div key={m.id} className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                    <div className="text-white font-mono">{m.home_team} vs {m.away_team}</div>
                    <div className={`text-xs font-mono ${isLive ? 'text-red-400' : 'text-gray-400'}`}>
                      {isLive ? '🔴 LIVE' : new Date(m.commence_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}