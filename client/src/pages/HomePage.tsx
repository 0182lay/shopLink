import { HomeHeader } from "../components/home/HomeHeader";
import { HomeHero } from "../components/home/HomeHero";
import { HomeServiceStrip } from "../components/home/HomeServiceStrip";
import { HomeShopSection } from "../components/home/HomeShopSection";
import { HomeFeaturedProducts } from "../components/home/HomeFeaturedProducts";
import { HomePopularCategories } from "../components/home/HomePopularCategories";
import { HomeFooter } from "../components/home/HomeFooter";
import { MobileBottomNav } from "../components/home/MobileBottomNav";

export function HomePage() {
    return (
        <main
            className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 text-shop-text md:pb-10"
            id="home"
        >
            <HomeHeader activePage="home" />
            <HomeHero />
            <HomePopularCategories />
            <HomeShopSection />
            <HomeFeaturedProducts />
            <HomeServiceStrip />
            <HomeFooter />
            <MobileBottomNav activePage="home" />
        </main>
    );
}
