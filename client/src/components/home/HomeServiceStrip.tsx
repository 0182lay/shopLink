const serviceItems = [
    {
        title: "ສົ່ງຂໍ້ຄວາມຜ່ານແຊັດ",
        detail: "ສົ່ງອໍເດີໃຫ້ຮ້ານໄດ້ທັນທີ",
        icon: "chat",
    },
    {
        title: "ສະຫຼຸບອໍເດີອັດຕະໂນມັດ",
        detail: "ລວມລາຍການໃຫ້ຊັດເຈນ",
        icon: "receipt",
    },
    {
        title: "ລວມຫຼາຍຮ້ານໃນບ່ອນດຽວ",
        detail: "ເລືອກຊື້ສິນຄ້າໄດ້ສະດວກ",
        icon: "store",
    },
    {
        title: "ພ້ອມໃຫ້ຄຳແນະນຳ",
        detail: "ສອບຖາມສິນຄ້າໄດ້ງ່າຍ",
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
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
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
        <section className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_6px_18px_rgba(51,51,51,0.035)] md:grid-cols-4">
                {serviceItems.map((item, index) => (
                    <article
                        key={item.title}
                        className="flex cursor-default items-center gap-4 border-b border-gray-100 px-6 py-5 md:border-b-0 md:border-r last:md:border-r-0"
                    >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-shop-light text-shop-primary">
                            <ServiceIcon type={item.icon} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-shop-text">
                                {item.title}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                {item.detail}
                            </p>
                        </div>
                        {index < serviceItems.length - 1 ? (
                            <span className="ml-auto hidden h-10 w-px bg-gray-100 md:block" />
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    );
}
