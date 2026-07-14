import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

const badges: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "تضمین اصالت",
    desc: "کالای اصلی با گارانتی",
    icon: ShieldCheck,
  },
  {
    title: "ارسال سریع",
    desc: "ارسال به سراسر کشور",
    icon: Truck,
  },
  {
    title: "مشاوره فنی",
    desc: "راهنمایی قبل از خرید",
    icon: Headphones,
  },
  {
    title: "قیمت رقابتی",
    desc: "مناسب پروژه و عمده",
    icon: BadgeCheck,
  },
];

export default function TrustBadges() {
  return (
    <section className="container-tasino py-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-4 shadow-card sm:grid-cols-4 sm:p-6">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex flex-col items-center gap-2 py-3 text-center sm:flex-row sm:gap-3 sm:text-right"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tasino-muted text-tasino-blue">
              <badge.icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-tasino-text">{badge.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
