import {
  Activity,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Radio,
  Scan,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  cpu: Cpu,
  radio: Radio,
  scan: Scan,
  bot: Bot,
  brain: BrainCircuit,
  board: CircuitBoard,
  wave: Waves,
  activity: Activity,
};

export const areaIconNames = Object.keys(icons);

export function AreaIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Cpu;
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={1.6} />;
}
