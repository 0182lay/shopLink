import { useEffect, useMemo, useState } from "react";
import homeImage from "../../assets/images/home/homeimg.png";

const slides = [
    {
        eyebrow: "ShopLink",
        title: "ລວມຮ້ານຄ້າໄວ້ບ່ອນດຽວ",
        highlight: "ເລືອກສິນຄ້າໄດ້ຕາມໃຈ",
        description: "testtttttttttttttttttttttttt",
        buttonText: "ເລີ່ມຊື້ເລີຍ",
        gradient: "from-[#fff7f2] via-[#fff1f1] to-[#ffe2d4]",
    },
    {
        eyebrow: "Multi Store",
        title: "ຄົ້ນຫາຮ້ານທີ່ໃຊ້",
        highlight: "ໄດ້ໄວກວ່າເກົ່າ",
        description: "ເບິ່ງຮ້ານ ໝວດໝູ່ ແລະສິນຄ້າແນະນຳໃນໜ້າດຽວ",
        buttonText: "ເບິ່ງຮ້ານຄ້າ",
        gradient: "from-[#fff3ec] via-[#fff8f5] to-[#ffd9ca]",
    },
    {
        eyebrow: "Fast Shopping",
        title: "ຊື້ງ່າຍ ຈັດການງ່າຍ",
        highlight: "ພ້ອມຕໍ່ຍອດ",
        description: "ວາງໂຄງໜ້າຫຼັກໃຫ້ຮອງຮັບຕະກ້າ ອໍເດີ ແລະ admin",
        buttonText: "ສຳຫຼວດສິນຄ້າ",
        gradient: "from-[#fff1f1] via-[#fff6ef] to-[#ffe6dd]",
    },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.3"
            />
        </svg>
    );
}

export function HomeHero() {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeSlide = slides[activeIndex];

    const goToNext = useMemo(
        () => () => {
            setActiveIndex((current) => (current + 1) % slides.length);
        },
        [],
    );

    function goToPrevious() {
        setActiveIndex((current) =>
            current === 0 ? slides.length - 1 : current - 1,
        );
    }

    useEffect(() => {
        const timer = window.setInterval(goToNext, 6500);

        return () => window.clearInterval(timer);
    }, [goToNext]);

    return (
        <section className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${activeSlide.gradient} shadow-sm ring-1 ring-red-100`}
            >
                <div className="pointer-events-none absolute left-1/2 top-10 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
                <div className="pointer-events-none absolute bottom-0 right-12 h-40 w-40 rounded-full bg-white/35 blur-3xl" />

                <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-6 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-shop-text shadow-md transition hover:bg-white hover:text-shop-primary max-sm:left-4"
                    aria-label="ສະໄລກ່ອນໜ້າ"
                >
                    <ArrowIcon direction="left" />
                </button>

                <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-6 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-shop-text shadow-md transition hover:bg-white hover:text-shop-primary max-sm:right-4"
                    aria-label="ສະໄລຖັດໄປ"
                >
                    <ArrowIcon direction="right" />
                </button>

                <div className="grid min-h-[250px] items-center gap-6 px-10 py-2 md:grid-cols-[0.9fr_1.1fr] lg:px-16">
                    <div
                        key={`copy-${activeIndex}`}
                        className="relative z-10 animate-[fadeUp_500ms_ease_both] pl-6 md:pl-6"
                    >
                        <p className="text-sm font-black uppercase tracking-wide text-shop-primary">
                            {activeSlide.eyebrow}
                        </p>
                        <h1 className="mt-2 max-w-xl text-3xl font-black leading-tight text-shop-text md:text-4xl">
                            {activeSlide.title}
                            <span className="block text-shop-primary">
                                {activeSlide.highlight}
                            </span>
                        </h1>
                        <p className="mt-3 max-w-lg text-sm leading-7 text-gray-700">
                            {activeSlide.description}
                        </p>
                        <button
                            type="button"
                            className="mt-5 inline-flex h-11 items-center rounded-lg bg-shop-primary px-5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-shop-secondary"
                        >
                            {activeSlide.buttonText}
                        </button>
                    </div>

                    <div className="relative z-10 flex justify-center md:justify-end">
                        <img
                            key={`image-${activeIndex}`}
                            src={homeImage}
                            alt="ShopLink marketplace"
                            className="h-[210px] w-full max-w-xl animate-[floatIn_650ms_ease_both] object-contain drop-shadow-2xl md:h-[270px]"
                        />
                    </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === activeIndex
                                    ? "w-8 bg-shop-primary"
                                    : "w-3 bg-shop-primary/20 hover:bg-shop-primary/40"
                            }`}
                            aria-label={`ໄປສະໄລ ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
