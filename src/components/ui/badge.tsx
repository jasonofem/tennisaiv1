import { cn } from "@/lib/utils";

export function Badge({ variant = "default", className, ...props }: any) {
  const variants: Record<string, string> = {
    default: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    high: "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(0,255,136,0.3)]",
    medium: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    low: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-semibold", variants[variant] || variants.default, className)} {...props} />
  );
}