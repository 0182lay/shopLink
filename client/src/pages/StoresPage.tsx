import { useMemo, useState } from "react";
import { HomeFooter } from "../components/home/HomeFooter";
import { HomeServiceStrip } from "../components/home/HomeServiceStrip";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { CircleIcon } from "../components/home/header/icons";
import type { Store } from "../types/store";

type StoreSortMode = "popular" | "name";

type StoreVisual = {
    match: string;
    image: string;
    logo: string;
    tone: string;
};

const storeVisuals: StoreVisual[] = [
    {
        match: "pet",
        image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=900&q=80",
        logo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=280&q=80",
        tone: "from-red-50 via-white to-red-50",
    },
    {
        match: "fish",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=900&q=80",
        logo: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=280&q=80",
        tone: "from-sky-50 via-white to-cyan-50",
    },
    {
        match: "toy",
        image: "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=900&q=80",
        logo: "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=280&q=80",
        tone: "from-orange-50 via-white to-amber-50",
    },
    {
        match: "computer",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
        logo: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=280&q=80",
        tone: "from-purple-50 via-white to-violet-50",
    },
];

const mockStores: Store[] = [
    {
        id: 1,
        name: "Ruby Pet Shop",
        slug: "ruby-pet-shop",
        description: "ຮ້ານອາຫານສັດ ອຸປະກອນ ແລະ ຂອງຫຼິ້ນສຳລັບສັດລ້ຽງ",
        isActive: true,
    },
    {
        id: 2,
        name: "Fish Shop",
        slug: "fish-shop",
        description: "ຮ້ານປາ ອາຫານປາ ແລະ ອຸປະກອນຕູ້ປາ",
        isActive: true,
    },
    {
        id: 3,
        name: "Toy Shop",
        slug: "toy-shop",
        description: "ຮ້ານຂອງຫຼິ້ນ ຂອງຂວັນ ແລະ ສິນຄ້ານ່າຮັກ",
        isActive: true,
    },
    {
        id: 4,
        name: "Computer Shop",
        slug: "computer-shop",
        description: "ຮ້ານຄອມພິວເຕີ ອຸປະກອນໄອທີ ແລະ ຂອງໃຊ້ດິຈິຕອນ",
        isActive: true,
    },
];

function getStoreVisual(store: Store, index: number) {
    const text = `${store.name} ${store.description ?? ""}`.toLowerCase();
    return storeVisuals.find((visual) => text.includes(visual.match)) ?? storeVisuals[index % storeVisuals.length];
}

function SortIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M7 7h10M9 12h8M11 17h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function StoresTopHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid h-16 grid-cols-[40px_1fr_auto] items-center gap-2 md:grid-cols-[220px_minmax(280px,1fr)_220px] md:gap-5">
                    <h1 className="col-start-2 truncate text-center text-base font-black text-shop-text md:text-lg">
                        ຮ້ານຄ້າທັງໝົດ
                    </h1>

                    <div className="flex shrink-0 items-center justify-end gap-2 text-shop-text">
                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
                        aria-label="ແຊັດ"
                    >
                        <CircleIcon type="chat" />
                    </button>
                    <button
                        type="button"
                        className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
                        aria-label="ກະຕ່າ"
                    >
                        <CircleIcon type="cart" />
                        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-shop-primary px-1 text-[10px] font-bold leading-none text-white">
                            3
                        </span>
                    </button>
                    </div>
                </div>
                </div>
        </header>
    );
}

function StoreCard({ store, index }: { store: Store; index: number }) {
    const visual = getStoreVisual(store, index);
    const description = store.description ?? "";
    const banner = store.bannerUrl || visual.image;
    const logo = store.logoUrl || visual.logo;

    return (
        <article className="group flex gap-3 overflow-hidden rounded-2xl border border-red-50 bg-white p-3 shadow-[0_8px_22px_rgba(51,51,51,0.055)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(229,57,53,0.12)] md:block md:p-0 md:hover:-translate-y-1 md:hover:shadow-[0_18px_36px_rgba(229,57,53,0.13)]">
            <div className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${visual.tone} md:h-32 md:w-full md:rounded-none`}>
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 hidden h-full w-full object-cover opacity-20 transition duration-500 group-hover:scale-105 md:block"
                />
                <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.72),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.56))] md:block" />
                <div className="grid h-full w-full place-items-center md:absolute md:left-1/2 md:top-9 md:h-20 md:w-20 md:-translate-x-1/2 md:overflow-hidden md:rounded-full md:border-[6px] md:border-white md:bg-white md:shadow-[0_14px_28px_rgba(51,51,51,0.16)]">
                    <img
                        src={logo}
                        alt={store.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            <div className="relative min-w-0 flex-1 py-1 pr-24 md:px-4 md:pb-5 md:pt-4 md:text-center">
                <h3 className="line-clamp-1 text-base font-black text-shop-text">
                    {store.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-gray-500 md:mx-auto md:min-h-[60px] md:max-w-xs md:line-clamp-3">
                    {description}
                </p>
                <a
                    href={`#/stores/${store.slug}`}
                    className="absolute right-0 top-1 inline-flex h-9 items-center justify-center rounded-xl border border-red-100 px-3 text-[11px] font-black text-shop-primary transition hover:border-shop-primary hover:bg-shop-primary hover:text-white md:static md:mt-3 md:w-full md:px-4 md:text-xs"
                >
                    ເຂົ້າຮ້ານຄ້າ
                </a>
            </div>
        </article>
    );
}

function sortStores(stores: Store[], sort: StoreSortMode) {
    if (sort === "name") {
        return [...stores].sort((a, b) => a.name.localeCompare(b.name));
    }

    return stores;
}

export function StoresPage() {
    const [sort, setSort] = useState<StoreSortMode>("popular");
    const visibleStores = useMemo(() => sortStores(mockStores, sort), [sort]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 pt-[68px] text-shop-text md:pb-10 md:pt-24">
            <StoresTopHeader />

            <section className="mx-auto max-w-7xl px-3 py-3 sm:px-6 md:py-5 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-shop-text md:text-4xl">
                            ຮ້ານຄ້າທັງໝົດ
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-gray-500 md:text-base">
                            ພົບຮ້ານຄ້າທີ່ໃຊ່ ສຳລັບສັດລ້ຽງທີ່ທ່ານຮັກ
                        </p>
                    </div>

                    <label className="relative w-fit">
                        <span className="sr-only">ຈັດຮຽງ</span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value as StoreSortMode)}
                            className="h-10 appearance-none rounded-2xl border border-red-100 bg-white py-0 pl-9 pr-8 text-xs font-black text-shop-text shadow-sm outline-none transition hover:border-shop-primary"
                        >
                            <option value="popular">ຈັດຮຽງ: ຍອດນິຍົມ</option>
                            <option value="name">ຈັດຮຽງ: ຊື່ຮ້ານ</option>
                        </select>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <SortIcon />
                        </span>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    d="m7 10 5 5 5-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                    </label>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
                    {visibleStores.map((store, index) => (
                        <StoreCard key={store.id} store={store} index={index} />
                    ))}
                </div>
            </section>

            <HomeServiceStrip />
            <HomeFooter />
            <MobileBottomNav activePage="stores" />
        </main>
    );
}
