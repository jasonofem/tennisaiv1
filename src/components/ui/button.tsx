import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", ...props }: any) {
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]",
    outline: "border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500/10",
  };
  return (
    <button
      className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium font-mono transition-all hover:scale-105 active:scale-95 disabled:opacity-50 h-11 px-6", variants[variant] || variants.default, className)}
      {...props}
    />
  );
}
