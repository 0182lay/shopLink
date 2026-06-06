import { HomeHeader } from "../components/home/HomeHeader";
import { HomeHero } from "../components/home/HomeHero";
import { HomeFeaturedProducts } from "../components/home/HomeFeaturedProducts";
import { HomeServiceStrip } from "../components/home/HomeServiceStrip";
import { HomeFooter } from "../components/home/HomeFooter";
import { MobileBottomNav } from "../components/home/MobileBottomNav";

export function HomePage() {
    return (
        <main
            className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-0 pt-[70px] text-shop-text md:pb-10 md:pt-28"
            id="home"
        >
            <HomeHeader activePage="home" />
            <HomeHero />
            <HomeFeaturedProducts />
            <HomeServiceStrip />
            <HomeFooter />
            <MobileBottomNav activePage="home" />
        </main>
    );
}
