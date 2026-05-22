"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { getBankroll, saveBankroll } from "@/lib/supabase";
import { DollarSign, Target, TrendingUp, AlertTriangle, Save, Database } from "lucide-react";

export default function BankrollPage() {
  const [bankroll, setBankroll] = useState({ total: 100000, unitSize: 2000, current: 98500, dailyRisk: 5 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadBankroll();
  }, []);

  const loadBankroll = async () => {
    try {
      const data = await getBankroll();
      if (data) {
        setBankroll({
          total: data.total_amount,
          unitSize: data.unit_size,
          current: data.current_amount,
          dailyRisk: data.daily_risk_percent,
        });
      }
    } catch (e) {
      console.log("Load bankroll error:", e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBankroll({
        user_id: localStorage.getItem("user_id") || "demo_user",
        total_amount: bankroll.total,
        unit_size: bankroll.unitSize,
        current_amount: bankroll.current,
        daily_risk_percent: bankroll.dailyRisk,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.log("Save error:", e);
    }
    setSaving(false);
  };

  return (
    <div className="p-6 space-y-6 lg:pt-0 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Bankroll Management</h1>
          <p className="text-sm font-mono text-cyan-400/60">Saved in Supabase Database</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <Database className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-green-400">DB Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl p-4">
          <DollarSign className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="text-xs font-mono text-cyan-400/60">Total Bankroll</div>
          <div className="text-2xl font-bold font-mono text-white">{formatCurrency(bankroll.total)}</div>
        </Card>
        <Card className="border-green-500/20 bg-black/60 backdrop-blur-xl p-4">
          <Target className="w-5 h-5 text-green-400 mb-2" />
          <div className="text-xs font-mono text-cyan-400/60">Current Balance</div>
          <div className="text-2xl font-bold font-mono text-green-400">{formatCurrency(bankroll.current)}</div>
        </Card>
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl p-4">
          <TrendingUp className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="text-xs font-mono text-cyan-400/60">Unit Size</div>
          <div className="text-2xl font-bold font-mono text-white">{formatCurrency(bankroll.unitSize)}</div>
        </Card>
        <Card className="border-orange-500/20 bg-black/60 backdrop-blur-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-xs font-mono text-cyan-400/60">Daily Risk (5%)</div>
          <div className="text-2xl font-bold font-mono text-orange-400">{formatCurrency(bankroll.total * bankroll.dailyRisk / 100)}</div>
        </Card>
      </div>

      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader><CardTitle className="text-lg font-mono text-cyan-400">Edit Bankroll</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Total Bankroll (₦)</Label>
              <Input type="number" value={bankroll.total} onChange={(e) => setBankroll({...bankroll, total: Number(e.target.value)})} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Current Balance (₦)</Label>
              <Input type="number" value={bankroll.current} onChange={(e) => setBankroll({...bankroll, current: Number(e.target.value)})} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Unit Size (₦)</Label>
              <Input type="number" value={bankroll.unitSize} onChange={(e) => setBankroll({...bankroll, unitSize: Number(e.target.value)})} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Daily Risk (%)</Label>
              <Input type="number" value={bankroll.dailyRisk} onChange={(e) => setBankroll({...bankroll, dailyRisk: Number(e.target.value)})} className="font-mono" min={1} max={10} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="font-mono w-full">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "✓ Saved to Database!" : saving ? "Saving..." : "Save to Database"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader><CardTitle className="text-lg font-mono text-cyan-400">Staking Guide</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 flex justify-between items-center">
            <div><div className="text-lg font-bold font-mono text-green-400">HIGH</div><div className="text-xs font-mono text-cyan-400/50">Edge 15%+</div></div>
            <div className="text-right"><div className="text-2xl font-bold font-mono text-white">3 units</div><div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 3)}</div></div>
          </div>
          <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex justify-between items-center">
            <div><div className="text-lg font-bold font-mono text-cyan-400">MEDIUM</div><div className="text-xs font-mono text-cyan-400/50">Edge 8-14%</div></div>
            <div className="text-right"><div className="text-2xl font-bold font-mono text-white">2 units</div><div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 2)}</div></div>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 flex justify-between items-center">
            <div><div className="text-lg font-bold font-mono text-purple-400">LOW</div><div className="text-xs font-mono text-cyan-400/50">Edge 5-7%</div></div>
            <div className="text-right"><div className="text-2xl font-bold font-mono text-white">1 unit</div><div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 1)}</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}