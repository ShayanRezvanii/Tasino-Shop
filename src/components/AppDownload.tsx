import Image from "next/image";
import { Phone, Wrench } from "lucide-react";

export default function AppDownload() {
  return (
    <section className="container-tasino py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-tasino-blue-deep via-tasino-blue-dark to-tasino-blue px-6 py-8 sm:px-10 sm:py-10">
        <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg text-white">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-tasino-yellow/20 px-3 py-1 text-xs font-bold text-tasino-yellow">
              <Wrench className="h-3.5 w-3.5" />
              مشاوره فنی پروژه
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">
              نیاز به راهنمایی برای انتخاب تجهیزات دارید؟
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              کارشناسان تاسینو برای انتخاب پمپ، لوله، شیرآلات و سیستم‌های حرارتی
              همراه شما هستند — مناسب پیمانکاران و پروژه‌های ساختمانی.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="tel:02112345678"
                className="flex items-center gap-2 rounded-xl bg-tasino-yellow px-4 py-2.5 text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark"
              >
                <Phone className="h-4 w-4" />
                تماس با مشاور
              </a>
              <a
                href="#products"
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25"
              >
                مشاهده کاتالوگ
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-40 w-48 sm:h-48 sm:w-56 lg:mx-0">
            <Image
              src="/products/water-pump.png"
              alt="تجهیزات تاسینو"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="224px"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-tasino-yellow/10" />
      </div>
    </section>
  );
}
