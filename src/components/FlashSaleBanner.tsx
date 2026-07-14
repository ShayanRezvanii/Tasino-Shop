import Image from "next/image";
import Countdown from "@/components/Countdown";
import { formatPrice } from "@/data/products";

export default function FlashSaleBanner() {
  return (
    <section className="container-tasino pb-6">
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card sm:flex-row">
        <div className="flex flex-col items-center justify-center gap-3 bg-tasino-blue px-6 py-6 text-white sm:min-w-[200px]">
          <h3 className="text-lg font-bold">فروش ویژه امروز</h3>
          <Countdown variant="red" size="sm" hours={6} minutes={22} seconds={41} />
        </div>

        <div className="relative flex flex-1 items-center gap-4 px-4 py-5 sm:px-8">
          <div className="relative h-24 w-28 shrink-0 sm:h-28 sm:w-36">
            <Image
              src="/products/cooler-pump.png"
              alt="پمپ کولر آبی"
              fill
              className="object-contain"
              sizes="144px"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">سرمایش و گرمایش</p>
            <h3 className="mt-1 text-base font-bold text-tasino-text sm:text-lg">
              پمپ آب کولر آبی صنعتی TS-CP450
            </h3>
            <p className="mt-1 text-sm text-tasino-blue font-bold">
              {formatPrice(890000)} تومان
              <span className="mr-2 text-xs font-normal text-slate-400 line-through">
                {formatPrice(1100000)}
              </span>
            </p>
          </div>
          <div className="absolute left-4 top-4 flex h-14 w-14 animate-pulse-soft items-center justify-center rounded-full bg-tasino-yellow text-sm font-black text-tasino-blue-deep shadow-md sm:static sm:h-16 sm:w-16 sm:shrink-0">
            ۱۹٪
          </div>
        </div>
      </div>
    </section>
  );
}
