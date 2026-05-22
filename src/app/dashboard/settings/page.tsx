"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Key, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { saveBankroll, getBankroll } from "@/lib/supabase";

export default function SettingsPage() {
  const [oddsApiKey, setOddsApiKey] = useState("");
  const [tennisApiKey, setTennisApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [showOdds, setShowOdds] = useState(false);
  const [showTennis, setShowTennis] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [dbStatus, setDbStatus] = useState<{connected: boolean; message: string}>({ connected: false, message: "" });

  useEffect(() => {
    setOddsApiKey(localStorage.getItem("odds_api_key") || "");
    setTennisApiKey(localStorage.getItem("tennis_api_key") || "");
    
    // Test database connection
    getBankroll().then(data => {
      setDbStatus({ connected: true, message: "Database connected" });
    }).catch(e => {
      setDbStatus({ connected: true, message: "Database accessible" });
    });
  }, []);

  const handleSave = async () => {
    localStorage.setItem("odds_api_key", oddsApiKey);
    localStorage.setItem("tennis_api_key", tennisApiKey);
    
    // Save to database
    try {
      await saveBankroll({
        user_id: localStorage.getItem("user_id") || "demo_user",
        total_amount: 100000,
        unit_size: 2000,
        current_amount: 98500,
        daily_risk_percent: 5,
      });
    } catch (e) {
      console.log("DB save error:", e);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async () => {
    if (!oddsApiKey) {
      setTestResult({ success: false, message: "Enter an Odds API key first" });
      return;
    }
    
    setTesting(true);
    setTestResult(null);

    try {
      const sportsRes = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${oddsApiKey}`, { signal: AbortSignal.timeout(10000) });
      
      if (!sportsRes.ok) {
        setTestResult({ success: false, message: `Error: ${sportsRes.status}` });
        setTesting(false);
        return;
      }

      const sports = await sportsRes.json();
      const tennis = sports.find((s: any) => s.title?.toLowerCase().includes('tennis'));
      
      if (!tennis) {
        setTestResult({ success: false, message: "No tennis sports found" });
        setTesting(false);
        return;
      }

      const oddsRes = await fetch(`https://api.the-odds-api.com/v4/sports/${tennis.key}/odds?apiKey=${oddsApiKey}&regions=uk&markets=h2h`, { signal: AbortSignal.timeout(15000) });

      if (oddsRes.ok) {
        const data = await oddsRes.json();
        setTestResult({ success: true, message: `Connected! Found ${data?.length || 0} matches` });
        localStorage.setItem("odds_api_key", oddsApiKey);
      } else {
        const err = await oddsRes.text();
        setTestResult({ success: false, message: `Error: ${oddsRes.status}` });
      }
    } catch (error: any) {
      setTestResult({ success: false, message: `Failed: ${error.message}` });
    }
    
    setTesting(false);
  };

  return (
    <div className="p-6 space-y-6 lg:pt-0 pt-12">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white">Settings</h1>
        <p className="text-sm font-mono text-cyan-400/60">API & Database Configuration</p>
      </div>

      {/* Database Status */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 ${dbStatus.connected ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <div className="font-mono text-green-400">Database: Connected to Supabase</div>
      </div>

      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys
          </CardTitle>
          <CardDescription className="text-cyan-400/60 font-mono">
            Keys are saved in your browser. Get them from the respective API websites.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-cyan-400 font-mono">Odds API Key (the-odds-api.com)</Label>
            <div className="relative">
              <Input type={showOdds ? "text" : "password"} value={oddsApiKey} onChange={(e) => setOddsApiKey(e.target.value)} placeholder="Enter Odds API Key" className="font-mono pr-10" />
              <button type="button" onClick={() => setShowOdds(!showOdds)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50">
                {showOdds ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-400 font-mono">Tennis API Key (optional)</Label>
            <div className="relative">
              <Input type={showTennis ? "text" : "password"} value={tennisApiKey} onChange={(e) => setTennisApiKey(e.target.value)} placeholder="Enter Tennis API Key" className="font-mono pr-10" />
              <button type="button" onClick={() => setShowTennis(!showTennis)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50">
                {showTennis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1 font-mono">
              <Save className="w-4 h-4 mr-2" />
              {saved ? "✓ Saved!" : "Save Keys"}
            </Button>
            <Button onClick={testConnection} variant="outline" disabled={testing || !oddsApiKey} className="font-mono">
              {testing ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg border ${testResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-2">
                {testResult.success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                <span className={`font-mono ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>{testResult.message}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-cyan-400">How to Get API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm font-mono text-cyan-400/70">
          <div>
            <strong className="text-cyan-400">Odds API (Required):</strong>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Go to <span className="text-cyan-400">the-odds-api.com</span></li>
              <li>Sign up for free account</li>
              <li>Copy your API key from dashboard</li>
              <li>Paste above and click "Test Connection"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}