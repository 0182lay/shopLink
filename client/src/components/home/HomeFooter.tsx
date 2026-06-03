import { BagIcon } from "./header/icons";

const menuLinks = [
    "ໜ້າຫຼັກ",
    "ຮ້ານຄ້າທັງໝົດ",
    "ໝວດໝູ່",
    "ກ່ຽວກັບເຮົາ",
    "ຕິດຕໍ່ເຮົາ",
];
const helpLinks = [
    "ວິທີສັ່ງຊື້",
    "ຄຳຖາມທີ່ພົບເລື້ອຍ",
    "ຕິດຕໍ່ຮ້ານຄ້າ",
    "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
    "ເງື່ອນໄຂການໃຊ້ບໍລິການ",
];

function SocialButton({ label }: { label: string }) {
    return (
        <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-shop-text shadow-[0_8px_20px_rgba(51,51,51,0.08)] ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:text-shop-primary"
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
            className="flex items-center justify-between gap-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:text-shop-primary"
        >
            <span>{label}</span>
            <span className="text-shop-primary">›</span>
        </a>
    );
}

export function HomeFooter() {
    return (
        <footer className="mt-5 border-t border-red-100 bg-white/80 backdrop-blur">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-9 sm:px-6 md:grid-cols-[1.3fr_1fr_1.15fr_1fr] lg:px-8">
                <div>
                    <a
                        href="#home"
                        className="inline-flex items-center gap-2 text-2xl font-black text-shop-primary"
                    >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-shop-primary text-white shadow-sm">
                            <BagIcon />
                        </span>
                        Ruby<span className="text-shop-text">Stores</span>
                    </a>
                    <p className="mt-4 max-w-xs text-sm font-medium leading-7 text-gray-600">
                        ເວັບຮວມຮ້ານຄ້າ ຊ່ວຍໃຫ້ລູກຄ້າເລືອກສິນຄ້າ
                        ແລະສົ່ງອໍເດີຫາຮ້ານໄດ້ງ່າຍຂຶ້ນ
                    </p>
                    <div className="mt-5 flex gap-3">
                        <SocialButton label="Facebook" />
                        <SocialButton label="Messenger" />
                        <SocialButton label="Instagram" />
                        <SocialButton label="Line" />
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-black text-shop-text">
                        ເມນູ
                    </h3>
                    <div className="space-y-1">
                        {menuLinks.map((link) => (
                            <FooterLink key={link} label={link} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-black text-shop-text">
                        ຊ່ວຍເຫຼືອ
                    </h3>
                    <div className="space-y-1">
                        {helpLinks.map((link) => (
                            <FooterLink key={link} label={link} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-black text-shop-text">
                        ຕິດຕໍ່ເຮົາ
                    </h3>
                    <div className="space-y-3 text-sm font-semibold text-gray-600">
                        <p>🟢 WhatsApp</p>
                        <p>🔵 Messenger</p>
                        <p>🔵 Facebook</p>
                        <p>✉️ support@rubystores.com</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-red-50 px-4 py-4 text-center text-xs font-semibold text-gray-500">
                © 2026 RubyStores. All rights reserved.
            </div>
        </footer>
    );
}
