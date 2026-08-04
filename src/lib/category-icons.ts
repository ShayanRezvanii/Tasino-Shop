import {
  Droplets,
  Flame,
  Gauge,
  Paintbrush,
  Pipette,
  Thermometer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type CategoryIconKey =
  | "Pump"
  | "Faucet"
  | "Zap"
  | "Thermometer"
  | "Flame"
  | "Wrench"
  | "Pipe"
  | "Paint";

export const CATEGORY_ICONS: {
  key: CategoryIconKey;
  label: string;
  Icon: LucideIcon;
}[] = [
  { key: "Pump", label: "پمپ", Icon: Gauge },
  { key: "Faucet", label: "شیرآلات", Icon: Droplets },
  { key: "Zap", label: "برق", Icon: Zap },
  { key: "Thermometer", label: "دما", Icon: Thermometer },
  { key: "Flame", label: "گرمایش", Icon: Flame },
  { key: "Wrench", label: "ابزار", Icon: Wrench },
  { key: "Pipe", label: "لوله", Icon: Pipette },
  { key: "Paint", label: "رنگ", Icon: Paintbrush },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  CATEGORY_ICONS.map((i) => [i.key, i.Icon])
);

export function getCategoryIcon(key?: string | null): LucideIcon {
  if (!key) return Wrench;
  return iconMap[key] ?? Wrench;
}
