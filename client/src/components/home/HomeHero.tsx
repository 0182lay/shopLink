import { useEffect, useMemo, useState } from "react";
import homeImage from "../../assets/images/home/homeimg.png";

const slides = [
    {
        eyebrow: "RubyStores",
        title: "ລວມຮ້ານຄ້າໄວ້ບ່ອນດຽວ",
        highlight: "ເລືອກຊື້ໄດ້ຕາມໃຈ",
        description:
            "ຄົ້ນຫາຮ້ານ ໝວດໝູ່ ແລະສິນຄ້າແນະນຳ ພ້ອມສົ່ງຄຳສັ່ງຊື້ໃຫ້ຮ້ານໄດ້ງ່າຍ",
        buttonText: "ເລືອກຊື້ສິນຄ້າ",
        gradient: "from-[#fff8f4] via-[#fff1ee] to-[#ffe0d4]",
    },
    {
        eyebrow: "Multi Store",
        title: "ຊື້ງ່າຍ ຈັດການງ່າຍ",
        highlight: "ພ້ອມຫຼາຍຮ້ານໃຫ້ເລືອກ",
        description:
            "ເບິ່ງຮ້ານແນະນຳ ສິນຄ້າຍອດນິຍົມ ແລະຈັດການຄຳສັ່ງຊື້ໃນບ່ອນດຽວ",
        buttonText: "ເບິ່ງຮ້ານທັງໝົດ",
        gradient: "from-[#fff4ef] via-[#fff9f6] to-[#ffdacc]",
    },
    {
        eyebrow: "Fast Shopping",
        title: "ສັ່ງຊື້ສະດວກ",
        highlight: "ຕິດຕໍ່ຮ້ານໄດ້ໄວ",
        description:
            "ເລືອກສິນຄ້າ ເພີ່ມໃສ່ກະຕ່າ ແລະສົ່ງລາຍການໃຫ້ຮ້ານຜ່ານແຊັດໄດ້ທັນທີ",
        buttonText: "ເລີ່ມຊື້ເລີຍ",
        gradient: "from-[#fff1f1] via-[#fff7f0] to-[#ffe4dc]",
    },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
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
        <section className="mx-auto mt-2 max-w-7xl px-4 sm:mt-4 sm:px-6 lg:px-8">
            <div
                className={`relative min-h-[168px] overflow-hidden rounded-2xl bg-gradient-to-r ${activeSlide.gradient} shadow-[0_10px_26px_rgba(229,57,53,0.07)] ring-1 ring-red-100 sm:min-h-[300px] sm:rounded-3xl sm:shadow-[0_14px_36px_rgba(229,57,53,0.08)] md:min-h-[340px]`}
            >
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/35 blur-sm sm:-right-10 sm:h-72 sm:w-72" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-40 bg-white/15 blur-2xl sm:h-56 sm:w-72" />

                <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-shop-text shadow-md transition hover:text-shop-primary sm:left-5 sm:grid sm:h-11 sm:w-11"
                    aria-label="ກັບໄປສະໄລກ່ອນໜ້າ"
                >
                    <ArrowIcon direction="left" />
                </button>

                <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-shop-text shadow-md transition hover:text-shop-primary sm:right-5 sm:grid sm:h-11 sm:w-11"
                    aria-label="ໄປສະໄລຖັດໄປ"
                >
                    <ArrowIcon direction="right" />
                </button>

                <div className="relative z-10 flex min-h-[168px] items-center px-5 py-4 pr-[42%] sm:min-h-[300px] sm:px-16 sm:py-8 md:min-h-[340px] lg:px-20">
                    <div
                        key={`copy-${activeIndex}`}
                        className="max-w-full animate-[fadeUp_500ms_ease_both] sm:max-w-lg md:max-w-xl"
                    >
                        <p className="text-[9px] font-black uppercase tracking-wide text-shop-primary sm:text-sm">
                            {activeSlide.eyebrow}
                        </p>
                        <h1 className="mt-1.5 text-[18px] font-black leading-[1.08] text-shop-text sm:mt-3 sm:text-4xl sm:leading-tight md:text-5xl">
                            {activeSlide.title}
                            <span className="block text-shop-primary">
                                {activeSlide.highlight}
                            </span>
                        </h1>
                        <p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-4 text-gray-700 sm:mt-4 sm:text-base sm:font-medium sm:leading-8">
                            {activeSlide.description}
                        </p>
                        <button
                            type="button"
                            className="mt-6 hidden h-12 items-center rounded-xl bg-shop-primary px-6 text-sm font-black text-white shadow-[0_16px_30px_rgba(229,57,53,0.26)] transition hover:bg-shop-secondary sm:inline-flex"
                        >
                            {activeSlide.buttonText}
                        </button>
                    </div>
                </div>

                <img
                    key={`image-${activeIndex}`}
                    src={homeImage}
                    alt="RubyStores marketplace"
                    className="absolute bottom-6 right-5 z-10 h-[82px] w-[32%] animate-[floatIn_650ms_ease_both] object-contain drop-shadow-xl sm:bottom-5 sm:right-10 sm:h-[235px] sm:w-[48%] md:h-[300px]"
                />

                <div className="absolute bottom-2.5 left-0 right-0 z-20 flex justify-center gap-1.5 sm:bottom-5 sm:gap-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === activeIndex
                                    ? "w-7 bg-shop-primary sm:w-9"
                                    : "w-2 bg-shop-primary/20 hover:bg-shop-primary/40 sm:w-3"
                            }`}
                            aria-label={`ໄປສະໄລ ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
