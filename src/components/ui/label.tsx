import { cn } from "@/lib/utils";

export function Label({ className, ...props }: any) {
  return (
    <label className={cn("text-sm font-medium text-cyan-400/80 font-mono", className)} {...props} />
  );
}
