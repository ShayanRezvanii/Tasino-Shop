import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function BlogSection() {
  return (
    <section id="guides" className="container-tasino py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-tasino-text">راهنمای خرید تأسیسات</h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-tasino-blue hover:underline"
        >
          همه مقالات
          <ArrowLeft className="h-4 w-4" />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card lg:grid lg:grid-cols-2">
        <div className="relative min-h-[220px] bg-tasino-muted lg:min-h-[280px]">
          <Image
            src="/products/water-pump.png"
            alt="راهنمای انتخاب پمپ آب"
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          <span className="w-fit rounded-lg bg-tasino-yellow/20 px-3 py-1 text-xs font-bold text-tasino-yellow-dark">
            پمپ و تجهیزات
          </span>
          <h3 className="text-xl font-bold leading-relaxed text-tasino-text sm:text-2xl">
            راهنمای انتخاب پمپ آب مناسب ساختمان
          </h3>
          <p className="text-sm leading-7 text-slate-600">
            قبل از خرید پمپ باید هد، دبی، نوع ساختمان و فشار شبکه را بررسی کنید.
            در این راهنما تفاوت پمپ محیطی، سانتریفیوژ و بوستر را توضیح می‌دهیم تا
            انتخاب بهتری داشته باشید.
          </p>
          <button
            type="button"
            className="mt-2 w-fit rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-tasino-blue-dark"
          >
            مطالعه بیشتر
          </button>
        </div>
      </div>
    </section>
  );
}
