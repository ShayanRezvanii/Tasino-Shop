export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  category: string;
  discount?: number;
  badge?: string;
  specs?: string;
};

export const products: Product[] = [
  {
    id: "1",
    title: "پمپ آب محیطی تک‌فاز مدل TS-PM750",
    image: "/products/water-pump.png",
    price: 4850000,
    oldPrice: 5600000,
    rating: 4.8,
    category: "پمپ و تجهیزات",
    discount: 13,
    badge: "پرفروش",
    specs: "۰.۷۵ کیلووات | هد ۲۵ متر",
  },
  {
    id: "2",
    title: "پمپ آب کولر آبی صنعتی مدل TS-CP450",
    image: "/products/cooler-pump.png",
    price: 890000,
    oldPrice: 1100000,
    rating: 4.6,
    category: "سرمایش و گرمایش",
    discount: 19,
    badge: "پیشنهاد ویژه",
    specs: "ورودی برق ۲۲۰V | خروجی شیلنگی",
  },
  {
    id: "3",
    title: "شیر مخلوط اهرمی روشویی کروم براق",
    image: "/products/faucet.svg",
    price: 1650000,
    oldPrice: 1980000,
    rating: 4.7,
    category: "شیرآلات",
    discount: 17,
    specs: "برنج آبکاری کروم | کارتریج سرامیکی",
  },
  {
    id: "4",
    title: "لوله و اتصالات ۵ لایه نیوپایپ ۲۰ میلی‌متر",
    image: "/products/pipes.svg",
    price: 245000,
    rating: 4.5,
    category: "لوله و اتصالات",
    badge: "موجودی انبار",
    specs: "مقاوم در برابر فشار و حرارت",
  },
  {
    id: "5",
    title: "آچار فرانسه ۱۲ اینچ حرفه‌ای صنعتی",
    image: "/products/tools.svg",
    price: 780000,
    oldPrice: 950000,
    rating: 4.4,
    category: "ابزارآلات",
    discount: 18,
    specs: "فک قابل تنظیم | فولاد سخت‌کاری شده",
  },
  {
    id: "6",
    title: "رادیاتور پنلی آلومینیومی ۷ پره",
    image: "/products/radiator.svg",
    price: 3200000,
    oldPrice: 3750000,
    rating: 4.9,
    category: "سرمایش و گرمایش",
    discount: 15,
    badge: "گارانتی ۲ ساله",
    specs: "انتقال حرارت بالا | نصب آسان",
  },
  {
    id: "7",
    title: "کلید مینیاتوری تک‌فاز ۱۶ آمپر",
    image: "/products/electrical.svg",
    price: 185000,
    rating: 4.3,
    category: "برق و روشنایی",
    specs: "محافظ اضافه جریان | استاندارد ملی",
  },
  {
    id: "8",
    title: "شیر یک‌طرفه برنجی ۱ اینچ",
    image: "/products/valve.svg",
    price: 420000,
    oldPrice: 510000,
    rating: 4.6,
    category: "شیرآلات",
    discount: 18,
    specs: "فشار کاری ۱۶ بار | رزوه استاندارد",
  },
];

export const categories = [
  { id: "1", title: "لوله و اتصالات", icon: "Pipe", desc: "لوله، زانو، سه راهی" },
  { id: "2", title: "شیرآلات", icon: "Faucet", desc: "شیر مخلوط و والو" },
  { id: "3", title: "پمپ و تجهیزات", icon: "Pump", desc: "پمپ آب و بوستر" },
  { id: "4", title: "ابزارآلات", icon: "Wrench", desc: "ابزار فنی و نصب" },
  { id: "5", title: "برق و روشنایی", icon: "Zap", desc: "کلید، سیم، لامپ" },
  { id: "6", title: "سرمایش و گرمایش", icon: "Thermometer", desc: "رادیاتور و کولر" },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}
