import Image from "next/image";
import { AtSign, Mail, MapPin, Phone, Share2 } from "lucide-react";

const footerColumns = [
  {
    title: "درباره تاسینو",
    links: ["داستان برند", "نمایندگی‌ها", "فرصت شغلی", "قوانین و مقررات"],
  },
  {
    title: "دسته‌بندی‌ها",
    links: [
      "لوله و اتصالات",
      "شیرآلات",
      "پمپ و تجهیزات",
      "ابزارآلات",
      "برق و روشنایی",
      "سرمایش و گرمایش",
    ],
  },
  {
    title: "خدمات مشتریان",
    links: ["پیگیری سفارش", "راهنمای خرید", "گارانتی کالا", "مرجوعی کالا"],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="mt-8 bg-tasino-blue-deep text-white">
      <div className="container-tasino grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/brand/logo.png"
            alt="Tasino"
            width={160}
            height={56}
            className="mb-4 h-14 w-auto rounded-lg bg-white object-contain p-2"
          />
          <p className="text-sm leading-7 text-white/70">
            تاسینو؛ فروشگاه تخصصی تجهیزات تأسیسات ساختمان — لوله و اتصالات،
            شیرآلات و ابزارآلات.
          </p>
          <p className="mt-3 text-xs font-medium text-tasino-yellow">
            تاسیسات | لوله کشی | ابزارآلات
          </p>
        </div>

        {footerColumns.slice(1).map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-base font-bold">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#products"
                    className="text-sm text-white/70 transition hover:text-tasino-yellow"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div id="contact">
          <h4 className="mb-4 text-base font-bold">تماس با ما</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tasino-yellow" />
              <span>تهران — مرکز پخش تجهیزات تأسیساتی</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-tasino-yellow" />
              <span dir="ltr">۰۲۱-۱۲۳۴ ۵۶۷۸</span>
            </li>
            <li className="flex items-center gap-2">
              <AtSign className="h-4 w-4 shrink-0 text-tasino-yellow" />
              <span>@tasino.shop</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-tasino-yellow" />
              <span>www.tasino.ir</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: AtSign, label: "اینستاگرام" },
              { Icon: Share2, label: "شبکه اجتماعی" },
              { Icon: Mail, label: "ایمیل" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-tasino-yellow hover:text-tasino-blue-deep"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tasino flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-white/50 sm:flex-row sm:text-right">
          <p>© ۱۴۰۴ تاسینو — تمامی حقوق محفوظ است.</p>
          <p>تجهیزات تأسیسات ساختمان</p>
        </div>
      </div>
    </footer>
  );
}
