import homeImage from "../../assets/images/home/homeimg.png";
import { AuthLogo } from "./AuthLogo";

type AuthBrandPanelProps = {
    mode: "login" | "register";
};

const features = {
    login: [
        {
            title: "ສັ່ງຊື້ຜ່ານແຊັດ",
            text: "ສົ່ງອໍເດີໃຫ້ຮ້ານໄດ້ທັນທີ",
            icon: "M6 8.5h12M6 12h8M5 5h14v10H9l-4 4z",
        },
        {
            title: "ຮວມຫຼາຍຮ້ານໃນບ່ອນດຽວ",
            text: "ເລືອກຊື້ສິນຄ້າໄດ້ສະດວກ",
            icon: "M5 6h2l1.4 8h8.8l1.3-5H8.1M10 19h.1M17 19h.1",
        },
        {
            title: "ໝັ້ນໃຈ ປອດໄພ",
            text: "ຂໍ້ມູນຂອງທ່ານປອດໄພ",
            icon: "M12 3l7 3v5c0 4.2-2.8 7.7-7 9-4.2-1.3-7-4.8-7-9V6z",
        },
    ],
    register: [
        {
            title: "ຈັດການຮ້ານຄ້າໄດ້ງ່າຍ",
            text: "ເພີ່ມສິນຄ້າ ຈັດການອໍເດີໃນທີ່ດຽວ",
            icon: "M4 6h16M6 6v14h12V6M9 10h6M9 14h6",
        },
        {
            title: "ຕິດຕາມຍອດຂາຍ",
            text: "ເບິ່ງພາບລວມການຂາຍໄດ້ຊັດເຈນ",
            icon: "M5 19V9M12 19V5M19 19v-8",
        },
        {
            title: "ມີທີມພ້ອມຊ່ວຍເຫຼືອ",
            text: "ພ້ອມດູແລຕະຫຼອດການໃຊ້ງານ",
            icon: "M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2M4 12v5h3v-5H4Zm13 0v5h3v-5h-3Z",
        },
    ],
};

export function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
    const isLogin = mode === "login";

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#fff6f2] to-[#ffe8de] px-7 py-8 md:px-10">
            <div className="pointer-events-none absolute left-10 top-32 h-8 w-8 rounded-full border-[8px] border-[#ffd0c2]/70 opacity-70" />
            <div className="pointer-events-none absolute right-16 top-24 h-6 w-6 rounded-full border-[6px] border-[#ffc7b7]/80 opacity-70" />
            <div className="pointer-events-none absolute right-24 top-56 h-7 w-7 rounded-full border-[8px] border-[#ffd7ca]/80 opacity-70" />

            <AuthLogo />

            <div className="relative z-10 mt-8 max-w-md">
                <p className="text-sm font-black uppercase tracking-wide text-shop-primary">
                    {isLogin ? "RubyStores" : "Multi store"}
                </p>
                <h1 className="mt-3 text-3xl font-black leading-tight text-shop-text md:text-4xl">
                    {isLogin ? (
                        <>
                            ຮວມຮ້ານຄ້າໄວ້
                            <span className="text-shop-primary">ໃນທີ່ດຽວ</span>
                        </>
                    ) : (
                        <>
                            ເລີ່ມຕົ້ນໃຊ້ງານ
                            <span className="text-shop-primary">ກັບເຮົາ</span>
                        </>
                    )}
                </h1>
                <p className="mt-4 text-base font-semibold leading-8 text-gray-700">
                    {isLogin
                        ? "ເລືອກຊື້ສິນຄ້າໄດ້ຕາມໃຈ ແລະ ສົ່ງອໍເດີຫາຮ້ານໄດ້ທັນທີ"
                        : "ສ້າງບັນຊີເພື່ອຈັດການຮ້ານຄ້າ ແລະ ເຂົ້າເຖິງຟີເຈີຂອງ RubyStores"}
                </p>
            </div>

            <div className="relative z-10 mt-7 space-y-5">
                {features[mode].map((feature) => (
                    <div key={feature.title} className="flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-shop-primary shadow-[0_8px_22px_rgba(229,57,53,0.12)]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                <path
                                    d={feature.icon}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        </span>
                        <span>
                            <span className="block text-sm font-black text-shop-text">
                                {feature.title}
                            </span>
                            <span className="mt-1 block text-sm font-medium text-gray-600">
                                {feature.text}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            <img
                src={homeImage}
                alt=""
                className="relative z-10 mt-5 h-44 w-full object-contain object-bottom md:h-56"
            />
        </section>
    );
}
