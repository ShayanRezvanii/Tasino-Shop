import {
  Droplets,
  Flame,
  Gauge,
  Pipette,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/data/products";

const iconMap: Record<string, LucideIcon> = {
  Pipe: Pipette,
  Faucet: Droplets,
  Pump: Gauge,
  Wrench,
  Zap,
  Thermometer: Flame,
};

export default function CategoryIcons() {
  return (
    <section id="categories" className="container-tasino py-8">
      <div className="mb-6 text-center sm:text-right">
        <h2 className="text-xl font-bold text-tasino-text sm:text-2xl">
          خرید بر اساس دسته‌بندی
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          لوله، شیرآلات، پمپ، ابزار، برق و سیستم‌های حرارتی
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Wrench;
          return (
            <a
              key={cat.id}
              href="#products"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-tasino-blue/30 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tasino-muted text-tasino-blue transition group-hover:bg-tasino-blue group-hover:text-white">
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-tasino-text">{cat.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{cat.desc}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
