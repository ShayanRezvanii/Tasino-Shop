import AmazingOffers from "@/components/AmazingOffers";
import AppDownload from "@/components/AppDownload";
import BlogSection from "@/components/BlogSection";
import CategoryIcons from "@/components/CategoryIcons";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroBanners from "@/components/HeroBanners";
import TrustBadges from "@/components/TrustBadges";

export default function Home() {
  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <main>
        <HeroBanners />
        <FlashSaleBanner />
        <CategoryIcons />
        <AmazingOffers />
        <AppDownload />
        <BlogSection />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
}
