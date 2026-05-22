import { cn } from "@/lib/utils";

export function Card({ className, ...props }: any) {
  return (
    <div className={cn("rounded-xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl", className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: any) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardContent({ className, ...props }: any) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: any) {
  return <h3 className={cn("text-xl font-bold text-white font-mono", className)} {...props} />;
}

export function CardDescription({ className, ...props }: any) {
  return <p className={cn("text-sm text-cyan-400/70", className)} {...props} />;
}

export function Button({ className, variant = "default", size = "default", ...props }: any) {
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]",
    outline: "border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500/10",
  };
  return (
    <button
      className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium font-mono transition-all hover:scale-105 active:scale-95 disabled:opacity-50 h-11 px-6", variants[variant], className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: any) {
  return (
    <input
      className={cn("flex h-12 w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-2 text-sm font-mono text-white placeholder:text-cyan-500/50 focus:border-cyan-400 focus:outline-none", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: any) {
  return (
    <label className={cn("text-sm font-medium text-cyan-400/80 font-mono", className)} {...props} />
  );
}