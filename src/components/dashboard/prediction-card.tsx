"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getTimeUntilMatch } from "@/lib/utils";
import { Target, Clock, Zap, ChevronDown, ChevronUp } from "lucide-react";

export function PredictionCard({ prediction, bankroll, index = 0 }: any) {
  const [expanded, setExpanded] = useState(false);
  const stakeAmount = (bankroll?.unitSize || 100) * prediction.suggestedUnits;
  const potentialWin = stakeAmount * (prediction.bookmakerOdds - 1);

  return (
    <Card className="border-cyan-500/30 hover:border-cyan-400/50 transition-all overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400/70 uppercase">{prediction.tournament}</span>
            </div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <span className={prediction.player1 === prediction.underdog ? "text-green-400" : "text-white"}>{prediction.player1}</span>
              <span className="text-cyan-500/50">vs</span>
              <span className={prediction.player2 === prediction.underdog ? "text-green-400" : "text-white"}>{prediction.player2}</span>
            </CardTitle>
            <div className="flex items-center gap-3 text-sm font-mono text-cyan-400/60">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getTimeUntilMatch(prediction.startTime)}</span>
            </div>
          </div>
          <Badge variant={prediction.confidence?.toLowerCase()}>{prediction.confidence}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400/60 uppercase">Market</span>
            <div className="text-sm font-mono text-white">Underdog To Win Set</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400/60 uppercase">Odds</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">{prediction.bookmakerOdds?.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400/60 uppercase">Edge</span>
            <div className={`text-2xl font-bold font-mono ${prediction.edge > 10 ? "text-green-400" : "text-cyan-400"}`}>+{prediction.edge?.toFixed(1)}%</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400/60 uppercase">Units</span>
            <div className="text-2xl font-bold font-mono text-white">{prediction.suggestedUnits}</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400/60">Stake</span>
              <div className="text-lg font-bold font-mono text-white">{formatCurrency(stakeAmount)}</div>
            </div>
            <div className="h-8 w-px bg-cyan-500/30" />
            <div>
              <span className="text-xs font-mono text-cyan-400/60">Potential Win</span>
              <div className="text-lg font-bold font-mono text-green-400">{formatCurrency(potentialWin)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">High Value</span>
          </div>
        </div>

        <div className="border-t border-cyan-500/10 pt-4">
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
            <span className="text-xs font-mono uppercase">Analysis</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expanded && (
            <p className="mt-3 p-3 rounded-lg bg-black/40 text-sm font-mono text-cyan-400/80">{prediction.reasoning}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}