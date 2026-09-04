import { cn } from "@/lib/utils";

export function TableContainer({ className, ...props }) {
  return (
    <div
      className={cn("w-full overflow-hidden rounded-lg border bg-card", className)}
      {...props}
    />
  );
}
