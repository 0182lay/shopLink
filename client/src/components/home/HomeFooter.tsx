import { BagIcon } from "./header/icons";

const menuLinks = [
    "ໜ້າຫຼັກ",
    "ສິນຄ້າທັງໝົດ",
    "ພວກເຮົາ",
    "ຂ່າວສານ ແລະ ບົດຄວາມ",
    "ຕິດຕໍ່ຮ້ານ",
];

const helpLinks = [
    "ວິທີສັ່ງຊື້",
    "ຄຳຖາມທີ່ພົບເລື້ອຍ",
    "ຕິດຕໍ່ຮ້ານຄ້າ",
    "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
    "ເງື່ອນໄຂການໃຊ້ງານ",
];

const mobileFooterLinks = [
    "ກ່ຽວກັບເຮົາ",
    "ຕິດຕໍ່ເຮົາ",
    "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
    "ຂໍ້ຕົກລົງການໃຊ້ງານ",
];

function SocialButton({ label }: { label: string }) {
    return (
        <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-shop-text shadow-[0_6px_16px_rgba(51,51,51,0.05)] ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:text-shop-primary"
            aria-label={label}
        >
            {label.charAt(0)}
        </button>
    );
}

function FooterLink({ label }: { label: string }) {
    return (
        <a
            href="#home"
            className="flex items-center gap-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:text-shop-primary"
        >
            <span className="text-shop-primary">›</span>
            <span>{label}</span>
        </a>
    );
}

export function HomeFooter() {
    return (
        <footer className="mt-7 border-t border-red-100 bg-white/85 pb-[76px] backdrop-blur md:mt-8 md:pb-0">
            <div className="mx-auto max-w-7xl px-4 py-7 text-center sm:px-6 md:grid md:grid-cols-[1.45fr_1fr_1.15fr_1fr] md:gap-12 md:py-10 md:text-left lg:px-8">
                <div className="mx-auto max-w-sm md:mx-0 md:max-w-none">
                    <a
                        href="#home"
                        className="inline-flex items-center justify-center gap-2 text-[22px] font-black text-shop-primary md:justify-start md:text-xl"
                    >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-shop-primary text-white shadow-sm md:h-9 md:w-9">
                            <BagIcon />
                        </span>
                        Ruby<span className="text-shop-text">Stores</span>
                    </a>
                    <p className="mx-auto mt-3 max-w-[18rem] text-sm font-medium leading-7 text-gray-600 md:mx-0 md:mt-4 md:max-w-sm">
                        ເປັນຮ້ານອອນໄລນ໌ ທີ່ມີສິນຄ້າຄຸນນະພາບ ແລະ
                        ບໍລິການທີ່ດີ ເພື່ອທຸກຄວາມຕ້ອງການຂອງທ່ານ.
                    </p>
                    <div className="mt-5 hidden gap-3 md:flex">
                        <SocialButton label="Facebook" />
                        <SocialButton label="Messenger" />
                        <SocialButton label="Instagram" />
                        <SocialButton label="YouTube" />
                    </div>
                </div>

                <div className="hidden md:block">
                    <h3 className="mb-3 text-sm font-black text-shop-text">
                        ເມນູ
                    </h3>
                    <div className="space-y-1">
                        {menuLinks.map((link) => (
                            <FooterLink key={link} label={link} />
                        ))}
                    </div>
                </div>

                <div className="hidden md:block">
                    <h3 className="mb-3 text-sm font-black text-shop-text">
                        ຊ່ວຍເຫຼືອ
                    </h3>
                    <div className="space-y-1">
                        {helpLinks.map((link) => (
                            <FooterLink key={link} label={link} />
                        ))}
                    </div>
                </div>

                <div className="hidden md:block">
                    <h3 className="mb-4 text-sm font-black text-shop-text">
                        ຕິດຕໍ່
                    </h3>
                    <div className="space-y-3 text-sm font-semibold text-gray-600">
                        <p>
                            <span className="text-green-500">●</span> WhatsApp
                        </p>
                        <p>
                            <span className="text-blue-500">●</span> Messenger
                        </p>
                        <p>
                            <span className="text-blue-600">●</span> Facebook
                        </p>
                        <p>
                            <span className="text-gray-500">✉</span>{" "}
                            support@rubystores.com
                        </p>
                    </div>
                </div>
            </div>

            <nav className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 pb-5 text-[11px] font-bold text-gray-500 md:hidden">
                {mobileFooterLinks.map((link, index) => (
                    <a
                        key={link}
                        href="#home"
                        className="inline-flex items-center gap-3 transition hover:text-shop-primary"
                    >
                        <span>{link}</span>
                        {index < mobileFooterLinks.length - 1 ? (
                            <span className="text-shop-primary">•</span>
                        ) : null}
                    </a>
                ))}
            </nav>

            <div className="border-t border-red-50 px-4 py-4 text-center text-xs font-semibold text-gray-500">
                © 2026 RubyStores. All rights reserved.
            </div>
        </footer>
    );
}
