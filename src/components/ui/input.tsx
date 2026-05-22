import { cn } from "@/lib/utils";

export function Input({ className, ...props }: any) {
  return (
    <input
      className={cn("flex h-12 w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-2 text-sm font-mono text-white placeholder:text-cyan-500/50 focus:border-cyan-400 focus:outline-none", className)}
      {...props}
    />
  );
}
