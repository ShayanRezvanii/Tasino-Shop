import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function AmazingOffers() {
  return (
    <section id="products" className="container-tasino py-4 pb-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-tasino-text sm:text-2xl">
            دموی محصولات تاسیساتی
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            نمونه کالاهای پرفروش لوله، پمپ، شیرآلات و ابزار
          </p>
        </div>
        <a
          href="#"
          className="hidden items-center gap-1 text-sm font-medium text-tasino-blue hover:underline sm:flex"
        >
          مشاهده همه
          <ArrowLeft className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
