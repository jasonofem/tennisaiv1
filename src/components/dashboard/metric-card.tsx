export function MetricCard({ title, value, prefix = "", suffix = "", decimals = 0, icon, variant = "default", className = "", trend }: any) {
  return (
    <div className={`p-4 rounded-xl border backdrop-blur-xl ${variant === "success" ? "border-green-500/20 bg-black/60" : "border-cyan-500/20 bg-black/60"} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-cyan-400/60 uppercase">{title}</span>
        {icon && <div className="text-cyan-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold font-mono text-white">
        {prefix}{typeof value === 'number' ? value.toFixed(decimals) : value}{suffix}
      </div>
      {trend !== undefined && (
        <div className="text-xs font-mono text-green-400/60 mt-1">+{trend}% vs last week</div>
      )}
    </div>
  );
}