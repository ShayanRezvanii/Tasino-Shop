import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, "")
    .toLowerCase();
}

type CatSeed = {
  name: string;
  icon: string;
  description?: string;
  children?: { name: string; icon?: string }[];
};

const categoryTree: CatSeed[] = [
  {
    name: "پمپ خانگی و ادوات",
    icon: "Pump",
    description: "پمپ آب خانگی و صنعتی و ملزومات",
    children: [
      { name: "مخزن تحت فشار" },
      { name: "اتوماتیک پمپ" },
      { name: "ست کنترل" },
      { name: "پمپ" },
      { name: "شیر یکطرفه" },
      { name: "پنج راهی" },
      { name: "گیج" },
      { name: "شلنگ فشار قوی" },
    ],
  },
  {
    name: "شیرآلات و یدکی",
    icon: "Faucet",
    description: "شیرآلات ساختمانی و قطعات یدکی",
    children: [
      { name: "مغزی شیر" },
      { name: "دسته شیر" },
      { name: "شیلنگ توالت" },
      { name: "شیلنگ دوش" },
      { name: "شیر پیسوار" },
      { name: "سیفون ها" },
      { name: "شیلنگ لباسشویی" },
      { name: "علم ظرفشویی" },
    ],
  },
  {
    name: "روشنایی و وسایل الکتریکی",
    icon: "Zap",
    description: "لامپ، سیم و محافظ",
    children: [
      { name: "لامپ ها" },
      { name: "سیم سیار" },
      { name: "محافظ ها" },
    ],
  },
  {
    name: "وسایل کولر",
    icon: "Thermometer",
    description: "قطعات و لوازم کولر آبی",
    children: [
      { name: "پمپ کولر" },
      { name: "دینام کولر" },
      { name: "شیر کولر" },
      { name: "شناور کولر" },
      { name: "یاتاقان" },
      { name: "حلزونی" },
      { name: "تسمه" },
      { name: "میل ۶۰" },
    ],
  },
  {
    name: "وسایل موتورخانه",
    icon: "Flame",
    description: "رله، واسطه و قطعات موتورخانه",
    children: [
      { name: "رله مشعل" },
      { name: "واسطه ی اچ وی" },
      { name: "واسطه ی آ آ" },
      { name: "واسطه ی آگوستات جداری" },
      { name: "آگوستات روی دیگ" },
      { name: "کوبلینگ" },
    ],
  },
  {
    name: "ابزارآلات و قفل",
    icon: "Wrench",
    description: "قفل و ابزار دستی",
    children: [
      { name: "قفل آویز ها" },
      { name: "قفل کتابی ها" },
      { name: "پیچ گوشتی" },
      { name: "آچار فرانسه" },
      { name: "انبر دست" },
      { name: "دم باریک" },
      { name: "سیم چین" },
    ],
  },
  {
    name: "لوله و اتصالات",
    icon: "Pipe",
    description: "آذین، پلیکا و گالوانیزه",
  },
  {
    name: "چسب و رنگ",
    icon: "Paint",
    description: "چسب لوله و رنگ ساختمانی",
  },
  {
    name: "گرمایش خانه و یدکی",
    icon: "Flame",
    description: "پکیج، رادیاتور و ملزومات نصب",
    children: [
      { name: "پکیج ها" },
      { name: "رادیاتورها" },
      { name: "ملزومات نصب پکیج" },
      { name: "ملزومات نصب رادیاتور" },
    ],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@12345",
    10
  );
  const admin = await prisma.user.create({
    data: {
      name: "مدیر تاسینو",
      email: process.env.ADMIN_EMAIL || "admin@tasino.ir",
      phone: "09120000000",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("Customer@123", 10);
  await prisma.user.create({
    data: {
      name: "کاربر نمونه",
      email: "user@tasino.ir",
      phone: "09121234567",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const parentIds: Record<string, string> = {};

  for (let i = 0; i < categoryTree.length; i++) {
    const cat = categoryTree[i];
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      },
    });
    parentIds[cat.name] = parent.id;

    if (cat.children) {
      for (let j = 0; j < cat.children.length; j++) {
        const child = cat.children[j];
        await prisma.category.create({
          data: {
            name: child.name,
            slug: slugify(`${cat.name}-${child.name}`),
            icon: child.icon || cat.icon,
            parentId: parent.id,
            sortOrder: j,
            isActive: true,
          },
        });
      }
    }
  }

  const pumpCat = parentIds["پمپ خانگی و ادوات"];
  const coolerCat = parentIds["وسایل کولر"];
  const faucetCat = parentIds["شیرآلات و یدکی"];
  const pipeCat = parentIds["لوله و اتصالات"];
  const toolCat = parentIds["ابزارآلات و قفل"];
  const heatCat = parentIds["گرمایش خانه و یدکی"];
  const elecCat = parentIds["روشنایی و وسایل الکتریکی"];

  const flashEnds = new Date();
  flashEnds.setHours(flashEnds.getHours() + 6);

  await prisma.product.createMany({
    data: [
      {
        title: "پمپ آب محیطی تک‌فاز مدل TS-PM750",
        slug: "pump-ts-pm750",
        image: "/products/water-pump.png",
        price: 4850000,
        oldPrice: 5600000,
        stock: 25,
        rating: 4.8,
        specs: "۰.۷۵ کیلووات | هد ۲۵ متر",
        badge: "پرفروش",
        isFeatured: true,
        categoryId: pumpCat,
      },
      {
        title: "پمپ آب کولر آبی صنعتی مدل TS-CP450",
        slug: "cooler-pump-ts-cp450",
        image: "/products/cooler-pump.png",
        price: 890000,
        oldPrice: 1100000,
        stock: 40,
        rating: 4.6,
        specs: "ورودی برق ۲۲۰V | خروجی شیلنگی",
        badge: "پیشنهاد ویژه",
        isFlashSale: true,
        flashEndsAt: flashEnds,
        categoryId: coolerCat,
      },
      {
        title: "شیر مخلوط اهرمی روشویی کروم براق",
        slug: "faucet-chrome-mixer",
        image: "/products/faucet.svg",
        price: 1650000,
        oldPrice: 1980000,
        stock: 30,
        rating: 4.7,
        specs: "برنج آبکاری کروم | کارتریج سرامیکی",
        categoryId: faucetCat,
      },
      {
        title: "لوله و اتصالات ۵ لایه نیوپایپ ۲۰ میلی‌متر",
        slug: "pipe-5layer-20mm",
        image: "/products/pipes.svg",
        price: 245000,
        stock: 200,
        rating: 4.5,
        specs: "مقاوم در برابر فشار و حرارت",
        badge: "موجودی انبار",
        categoryId: pipeCat,
      },
      {
        title: "آچار فرانسه ۱۲ اینچ حرفه‌ای صنعتی",
        slug: "wrench-12inch",
        image: "/products/tools.svg",
        price: 780000,
        oldPrice: 950000,
        stock: 50,
        rating: 4.4,
        specs: "فک قابل تنظیم | فولاد سخت‌کاری شده",
        categoryId: toolCat,
      },
      {
        title: "رادیاتور پنلی آلومینیومی ۷ پره",
        slug: "radiator-7panel",
        image: "/products/radiator.svg",
        price: 3200000,
        oldPrice: 3750000,
        stock: 15,
        rating: 4.9,
        specs: "انتقال حرارت بالا | نصب آسان",
        badge: "گارانتی ۲ ساله",
        categoryId: heatCat,
      },
      {
        title: "کلید مینیاتوری تک‌فاز ۱۶ آمپر",
        slug: "mcb-16a",
        image: "/products/electrical.svg",
        price: 185000,
        stock: 100,
        rating: 4.3,
        specs: "محافظ اضافه جریان | استاندارد ملی",
        categoryId: elecCat,
      },
      {
        title: "شیر یک‌طرفه برنجی ۱ اینچ",
        slug: "check-valve-1inch",
        image: "/products/valve.svg",
        price: 420000,
        oldPrice: 510000,
        stock: 60,
        rating: 4.6,
        specs: "فشار کاری ۱۶ بار | رزوه استاندارد",
        categoryId: pumpCat,
      },
    ],
  });

  await prisma.banner.createMany({
    data: [
      {
        title: "تجهیزات تأسیسات ساختمان",
        subtitle:
          "لوله و اتصالات، شیرآلات، پمپ، ابزارآلات و سیستم‌های سرمایش و گرمایش",
        image: "/brand/logo.png",
        link: "/products",
        buttonText: "مشاهده محصولات",
        type: "HERO",
        sortOrder: 0,
        isActive: true,
      },
      {
        title: "پمپ آب محیطی TS-PM750",
        subtitle: "۰.۷۵ کیلووات | هد ۲۵ متر | تک‌فاز",
        image: "/products/water-pump.png",
        link: "/products/pump-ts-pm750",
        buttonText: "خرید سریع",
        type: "SIDE",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "فروش ویژه امروز",
        subtitle: "پمپ آب کولر آبی صنعتی TS-CP450",
        image: "/products/cooler-pump.png",
        link: "/products/cooler-pump-ts-cp450",
        buttonText: "خرید",
        type: "FLASH",
        sortOrder: 0,
        isActive: true,
      },
    ],
  });

  await prisma.setting.createMany({
    data: [
      { key: "site_phone", value: "02112345678" },
      { key: "site_title", value: "تاسینو" },
      { key: "free_shipping_min", value: "5000000" },
      { key: "shipping_cost", value: "85000" },
    ],
  });

  console.log("Seed OK");
  console.log("Admin:", admin.email, process.env.ADMIN_PASSWORD || "Admin@12345");
  console.log("Customer: user@tasino.ir / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
