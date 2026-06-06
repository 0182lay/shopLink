const serviceItems = [
    {
        title: "ສັ່ງງ່າຍ",
        detail: "ຜ່ານແຊັດ",
        icon: "chat",
    },
    {
        title: "ສະຫຼຸບອໍເດີ",
        detail: "ອັດຕະໂນມັດ",
        icon: "receipt",
    },
    {
        title: "ຫຼາຍຮ້ານ",
        detail: "ໃນບ່ອນດຽວ",
        icon: "store",
    },
    {
        title: "ແນະນຳສິນຄ້າ",
        detail: "ຕອບໄວ",
        icon: "support",
    },
];

function ServiceIcon({ type }: { type: string }) {
    const paths: Record<string, string> = {
        chat: "M5 6h14v9H9l-4 4zM8 9h8M8 12h5",
        receipt:
            "M7 4h10v16l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3zM9 8h6M9 12h6M9 16h4",
        store: "M5 10h14l-1-5H6zM7 10v9h10v-9M9 14h6",
        support:
            "M5 13a7 7 0 0 1 14 0v3a2 2 0 0 1-2 2h-2v-6h4M5 16a2 2 0 0 0 2 2h2v-6H5z",
    };

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d={paths[type]}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

export function HomeServiceStrip() {
    return (
        <section className="mx-auto mt-4 max-w-7xl px-3 sm:px-6 lg:px-8 md:mt-3">
            <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_4px_14px_rgba(51,51,51,0.025)]">
                {serviceItems.map((item) => (
                    <article
                        key={item.title}
                        className="flex min-h-[64px] cursor-default flex-col items-center justify-center gap-1 border-r border-gray-100 px-1.5 py-2 text-center last:border-r-0 sm:min-h-[70px] md:flex-row md:justify-start md:gap-3 md:px-5 md:text-left"
                    >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-shop-light text-shop-primary md:h-10 md:w-10">
                            <ServiceIcon type={item.icon} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[10px] font-black leading-4 text-shop-text sm:text-[11px] md:text-[13px]">
                                {item.title}
                            </h3>
                            <p className="mt-0.5 text-[9px] font-semibold leading-3 text-gray-500 sm:text-[10px] md:text-[11px] md:leading-4">
                                {item.detail}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
