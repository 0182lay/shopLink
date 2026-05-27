import { HomeHeader } from "../components/home/HomeHeader";
import { HomeHero } from "../components/home/HomeHero";
import { HomeServiceStrip } from "../components/home/HomeServiceStrip";
import { HomeShopSection } from "../components/home/HomeShopSection";

export function HomePage() {
    return (
        <main className="min-h-screen bg-shop-neutral text-shop-text" id="home">
            <HomeHeader />
            <HomeHero />
            <HomeShopSection />
            <HomeServiceStrip />
        </main>
    );
}
