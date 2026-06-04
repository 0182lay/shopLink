import type { Store } from "../../types/store";

type StoreCardProps = {
    store: Store;
    index?: number;
};

const storeVisuals = [
    {
        match: "computer",
        icon: "💻",
        scene: ["🖥️", "🎧", "⌨️"],
        banner: "from-[#0056b8] via-[#0a8fe8] to-[#bfe9ff]",
        glow: "bg-cyan-200/45",
        ring: "bg-[#eaf6ff]",
        title: "ອຸປະກອນໄອທີ & ຄອມພິວເຕີ",
        items: "128",
    },
    {
        match: "toy",
        icon: "🧸",
        scene: ["🚗", "🧩", "🎁"],
        banner: "from-[#ff91bc] via-[#ffd0e4] to-[#fff0f7]",
        glow: "bg-pink-200/45",
        ring: "bg-[#fff0f6]",
        title: "ຂອງຫຼິ້ນ & ຂອງສະສົມ",
        items: "96",
    },
    {
        match: "fish",
        icon: "🐠",
        scene: ["🌿", "🐟", "🫧"],
        banner: "from-[#1cc7e8] via-[#8ee9f6] to-[#e9fdff]",
        glow: "bg-cyan-100/60",
        ring: "bg-[#eafbff]",
        title: "ຕູ້ປາ & ອຸປະກອນລ້ຽງປາ",
        items: "74",
    },
    {
        match: "pet",
        icon: "🐾",
        scene: ["🥣", "🌿", "🦴"],
        banner: "from-[#69c66f] via-[#c8f0c8] to-[#fff4dd]",
        glow: "bg-green-100/60",
        ring: "bg-[#f0f9ea]",
        title: "ອາຫານສັດລ້ຽງ & ອຸປະກອນ",
        items: "85",
    },
];

function getStoreVisual(store: Store, index = 0) {
    const text = `${store.name} ${store.description ?? ""}`.toLowerCase();
    const matched = storeVisuals.find((visual) => text.includes(visual.match));

    return matched ?? storeVisuals[index % storeVisuals.length];
}

export function StoreCard({ store, index }: StoreCardProps) {
    const visual = getStoreVisual(store, index);
    const description = store.description || visual.title;
    const hasBannerImage = Boolean(store.bannerUrl);

    return (
        <article className="group overflow-hidden rounded-xl border border-red-50 bg-white shadow-[0_8px_22px_rgba(51,51,51,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(229,57,53,0.12)]">
            <div className={`relative z-20 h-[118px] overflow-visible bg-gradient-to-br ${visual.banner} sm:h-[132px]`}>
                {store.bannerUrl ? (
                    <img
                        src={store.bannerUrl}
                        alt={`${store.name} banner`}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : null}
                <div className={`absolute -left-10 -top-10 h-32 w-32 rounded-full ${visual.glow} blur-2xl`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_28%,rgba(255,255,255,0.58),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.34))]" />

                {!hasBannerImage ? (
                    <>
                        <span className="absolute left-5 top-5 z-10 text-5xl drop-shadow-sm sm:text-6xl">
                            {visual.scene[0]}
                        </span>
                        <span className="absolute right-5 top-5 z-10 text-5xl drop-shadow-sm sm:text-6xl">
                            {visual.scene[1]}
                        </span>
                        <span className="absolute bottom-4 right-20 z-10 text-4xl drop-shadow-sm sm:text-5xl">
                            {visual.scene[2]}
                        </span>
                    </>
                ) : null}

                <div className={`absolute left-1/2 top-[72px] z-30 grid h-[76px] w-[76px] -translate-x-1/2 place-items-center rounded-full border-[6px] border-white ${visual.ring} shadow-[0_16px_30px_rgba(51,51,51,0.20),0_0_0_1px_rgba(229,57,53,0.08)] sm:top-[78px] sm:h-[86px] sm:w-[86px]`}>
                    {store.logoUrl ? (
                        <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                        />
                    ) : (
                        <span className="text-4xl sm:text-5xl">{visual.icon}</span>
                    )}
                </div>
            </div>

            <div className="relative z-10 bg-white px-3 pb-3 pt-11 text-center sm:px-4 sm:pb-4 sm:pt-12">
                <h3 className="truncate text-sm font-black text-shop-text sm:text-base">
                    {store.name}
                </h3>
                <p className="mt-1 truncate text-[11px] font-semibold text-gray-500 sm:text-xs">
                    {description}
                </p>

                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-gray-500 sm:text-[11px]">
                    <span className="text-gray-400">▣</span>
                    <span>ສິນຄ້າທັງໝົດ {visual.items} ລາຍການ</span>
                </div>

                <button
                    type="button"
                    className="mt-3 h-9 w-full rounded-lg bg-shop-primary text-xs font-black text-white shadow-[0_8px_16px_rgba(229,57,53,0.18)] transition hover:bg-shop-secondary sm:h-10 sm:text-sm"
                >
                    ເຂົ້າຮ້ານຄ້າ
                </button>
            </div>
        </article>
    );
}
