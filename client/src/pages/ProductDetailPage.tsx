import { useEffect, useMemo, useState } from "react";
import { HomeHeader } from "../components/home/HomeHeader";
import { BagIcon, CircleIcon, SearchIcon } from "../components/home/header/icons";
import { api, type Product } from "../lib/api";
import type { Store } from "../types/store";

type ProductDetailPageProps = {
    productId: number;
};

type ServicePoint = {
    title: string;
    text: string;
    icon: "shield" | "truck" | "return";
};

const servicePoints: ServicePoint[] = [
    { title: "ຂອງແທ້ 100%", text: "ຮັບປະກັນສິນຄ້າແທ້", icon: "shield" },
    { title: "ຈັດສົ່ງໄວ", text: "ສົ່ງໃຈ 1-2 ວັນ", icon: "truck" },
    { title: "ຄືນສິນຄ້າໄດ້", text: "ພາຍໃນ 7 ວັນ", icon: "return" },
];

const formatPrice = (price: Product["price"]) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

function BackIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
            />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <path
                d="M20.8 8.8c0 5.3-8.8 10-8.8 10s-8.8-4.7-8.8-10A4.7 4.7 0 0 1 12 5.7a4.7 4.7 0 0 1 8.8 3.1Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-400" aria-hidden="true">
            <path
                d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9z"
                fill="currentColor"
            />
        </svg>
    );
}

function ServiceIcon({ type }: { type: ServicePoint["icon"] }) {
    const paths = {
        shield: "M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6zM9 12l2 2 4-4",
        truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19h.1M18 19h.1",
        return: "M9 7H5v4M5 11a7 7 0 1 0 2-5",
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

function MobileProductHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur md:hidden">
            <div className="flex h-16 items-center gap-3 px-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="grid h-10 w-8 place-items-center text-shop-text"
                    aria-label="ກັບຄືນ"
                >
                    <BackIcon />
                </button>

                <a href="#/home" className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-shop-primary text-white shadow-[0_10px_20px_rgba(229,57,53,0.22)]">
                        <BagIcon />
                    </span>
                    <span className="truncate text-2xl font-black tracking-tight text-shop-text">
                        <span className="text-shop-primary">Ruby</span>Stores
                    </span>
                </a>

                <button
                    type="button"
                    onClick={() => {
                        window.location.hash = "#/search-entry";
                    }}
                    className="grid h-10 w-10 place-items-center rounded-full text-shop-text"
                    aria-label="ຄົ້ນຫາ"
                >
                    <SearchIcon />
                </button>
                <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full text-shop-text"
                    aria-label="ແຊທ"
                >
                    <CircleIcon type="chat" />
                </button>
                <button
                    type="button"
                    className="relative grid h-10 w-10 place-items-center rounded-full text-shop-text"
                    aria-label="ກະຕ່າ"
                >
                    <CircleIcon type="cart" />
                    <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-shop-primary px-1 text-[11px] font-black leading-none text-white">
                        3
                    </span>
                </button>
            </div>
        </header>
    );
}

function QuantityButton({
    label,
    onClick,
    disabled,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="grid h-11 w-12 place-items-center border border-gray-200 bg-gray-50 text-xl font-black text-shop-text transition hover:text-shop-primary disabled:cursor-not-allowed disabled:opacity-40 first:rounded-l-xl last:rounded-r-xl"
        >
            {label}
        </button>
    );
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadProduct() {
            setIsLoading(true);

            try {
                const [productResult, productsResult, storesResult] =
                    await Promise.allSettled([
                        api.product(productId),
                        api.products(),
                        api.stores(),
                    ]);

                if (!isMounted) {
                    return;
                }

                const detailProduct =
                    productResult.status === "fulfilled"
                        ? productResult.value.data ?? null
                        : null;
                const fallbackProduct =
                    productsResult.status === "fulfilled"
                        ? (productsResult.value.data ?? []).find(
                              (item) => item.id === productId,
                          ) ?? null
                        : null;
                const activeStores =
                    storesResult.status === "fulfilled"
                        ? (storesResult.value.data ?? []).filter((store) => store.isActive)
                        : [];

                setProduct(detailProduct ?? fallbackProduct);
                setStores(activeStores);
            } catch {
                if (isMounted) {
                    setProduct(null);
                    setStores([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    const store = useMemo(
        () => stores.find((item) => item.id === product?.storeId),
        [product?.storeId, stores],
    );
    const gallery = useMemo(() => {
        const image = product?.imageUrl;
        return image ? [image, image, image, image] : [];
    }, [product?.imageUrl]);

    function handleAddToCart() {
        setMessage("ເພີ່ມລົງກະຕ່າແລ້ວ");
    }

    function handleBuyNow() {
        setMessage("ຂັ້ນຕອນສັ່ງຊື້ຈະເຮັດຕໍ່ໄປ");
    }

    return (
        <main className="min-h-screen bg-white pb-10 pt-16 text-shop-text md:bg-gradient-to-b md:from-white md:via-[#fffafa] md:to-[#fff4f1] md:pt-28">
            <div className="hidden md:block">
                <HomeHeader activePage="products" />
            </div>
            <MobileProductHeader />

            <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
                {isLoading ? (
                    <div className="grid gap-8 md:grid-cols-[560px_minmax(0,1fr)]">
                        <div className="aspect-square animate-pulse rounded-[24px] bg-gray-100" />
                        <div className="h-96 animate-pulse rounded-[24px] bg-gray-100" />
                    </div>
                ) : !product ? (
                    <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm font-bold text-shop-primary shadow-sm">
                        ບໍ່ພົບສິນຄ້ານີ້
                    </div>
                ) : (
                    <>
                        <div className="mb-6 hidden items-center gap-3 text-sm font-bold text-gray-500 md:flex">
                            <a href="#/home" className="hover:text-shop-primary">
                                ໜ້າແຮກ
                            </a>
                            <span>/</span>
                            <a href="#/products" className="hover:text-shop-primary">
                                ສິນຄ້າ
                            </a>
                            <span>/</span>
                            <span className="line-clamp-1 text-shop-text">
                                {product.name}
                            </span>
                        </div>

                        <div className="grid gap-7 md:grid-cols-[96px_minmax(0,560px)_minmax(420px,1fr)] md:items-start md:gap-8">
                            <div className="hidden flex-col gap-5 md:flex">
                                {gallery.slice(0, 4).map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        className={`aspect-square overflow-hidden rounded-xl border bg-white p-1 shadow-sm ${
                                            index === 0
                                                ? "border-shop-primary"
                                                : "border-gray-100"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt=""
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="relative overflow-hidden rounded-[22px] bg-[#f7f7f7] shadow-[0_10px_32px_rgba(51,51,51,0.08)] md:rounded-[18px]">
                                <button
                                    type="button"
                                    className="absolute right-5 top-5 z-10 grid h-16 w-16 place-items-center rounded-full bg-white text-shop-text shadow-[0_10px_24px_rgba(51,51,51,0.12)] transition hover:text-shop-primary md:h-12 md:w-12"
                                    aria-label="ຖືກໃຈ"
                                >
                                    <HeartIcon />
                                </button>

                                <div className="flex aspect-[1.34/1] items-center justify-center md:aspect-square">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-gray-400 shadow-sm">
                                            <CircleIcon type="cart" />
                                        </div>
                                    )}
                                </div>

                                <span className="absolute bottom-3 left-1/2 grid h-10 min-w-16 -translate-x-1/2 place-items-center rounded-full bg-white/95 px-4 text-sm font-black text-gray-600 shadow-sm md:hidden">
                                    1/5
                                </span>
                                <button
                                    type="button"
                                    className="absolute bottom-4 right-4 hidden h-11 w-11 place-items-center rounded-full bg-white text-shop-text shadow-[0_8px_18px_rgba(51,51,51,0.12)] md:grid"
                                    aria-label="ຊູມຮູບ"
                                >
                                    <SearchIcon />
                                </button>
                            </div>

                            <div className="md:pt-5">
                                {product.isFeatured ? (
                                    <span className="hidden rounded-lg bg-shop-primary px-3 py-1.5 text-xs font-black text-white md:inline-flex">
                                        -20%
                                    </span>
                                ) : null}

                                <h1 className="mt-4 text-[28px] font-black leading-tight text-shop-text md:text-3xl">
                                    {product.name}
                                </h1>

                                <a
                                    href="#/stores"
                                    className="mt-4 inline-flex items-center gap-3 text-sm font-black text-shop-text transition hover:text-shop-primary"
                                >
                                    <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-red-50 text-shop-primary">
                                        {store?.logoUrl ? (
                                            <img
                                                src={store.logoUrl}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <BagIcon />
                                        )}
                                    </span>
                                    <span>ຮ້ານຄ້າ: {store?.name ?? "RubyStores"}</span>
                                    <span className="text-gray-400">›</span>
                                </a>

                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
                                    <span className="inline-flex items-center gap-1 text-shop-text">
                                        <StarIcon />
                                        4.9
                                    </span>
                                    <span>(128)</span>
                                    <span className="h-5 w-px bg-gray-300" />
                                    <span>ຂາຍແລ້ວ 12.8K ຊິ້ນ</span>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-4">
                                    <p className="text-4xl font-black text-shop-primary md:text-[34px]">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xl font-bold text-gray-400 line-through">
                                        {formatPrice(Number(product.price) * 1.25)}
                                    </p>
                                    <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-shop-primary">
                                        ປະຢັດ 20%
                                    </span>
                                </div>

                                <p className="mt-5 text-base font-semibold leading-7 text-gray-600">
                                    {product.description ??
                                        "ສິນຄ້າຄຸນນະພາບ ເໝາະສຳລັບການໃຊ້ງານປະຈຳວັນ"}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-5 text-sm font-black">
                                    <span className="inline-flex items-center gap-2 text-green-600">
                                        <span className="grid h-6 w-6 place-items-center rounded-full bg-green-50">
                                            ✓
                                        </span>
                                        ມີສິນຄ້າ
                                    </span>
                                    <span className="h-5 w-px bg-gray-300" />
                                    <span className="text-gray-500">
                                        ຄົງເຫຼືອ {product.stock} ຊິ້ນ
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <h2 className="text-base font-black text-shop-text">
                                        ລາຍລະອຽດ
                                    </h2>
                                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-gray-600 md:line-clamp-none">
                                        {product.description ??
                                            "ລາຍລະອຽດສິນຄ້າຈະສະແດງຢູ່ບ່ອນນີ້ ເພື່ອໃຫ້ລູກຄ້າເຂົ້າໃຈກ່ອນສັ່ງຊື້"}
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-2 text-sm font-black text-shop-primary"
                                    >
                                        ດູເພີ່ມເຕີມ⌄
                                    </button>
                                </div>

                                <div className="mt-7">
                                    <h2 className="text-base font-black text-shop-text">
                                        ຂະໜາດ
                                    </h2>
                                    <div className="mt-3 flex gap-4">
                                        <button className="min-w-32 rounded-xl border border-shop-primary bg-white px-6 py-4 text-center text-sm font-black text-shop-text">
                                            2kg
                                        </button>
                                        <button className="min-w-32 rounded-xl border border-gray-200 bg-white px-6 py-4 text-center text-sm font-black text-shop-text">
                                            10kg
                                            <span className="mt-1 block text-xs font-bold text-gray-500">
                                                {formatPrice(Number(product.price) * 3.5)}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-7 flex flex-wrap items-center gap-5">
                                    <h2 className="text-base font-black text-shop-text">
                                        ຈຳນວນ
                                    </h2>
                                    <div className="inline-flex overflow-hidden rounded-xl">
                                        <QuantityButton
                                            label="-"
                                            onClick={() =>
                                                setQuantity((current) =>
                                                    Math.max(1, current - 1),
                                                )
                                            }
                                            disabled={quantity <= 1}
                                        />
                                        <span className="grid h-11 w-16 place-items-center border-y border-gray-200 bg-white text-sm font-black">
                                            {quantity}
                                        </span>
                                        <QuantityButton
                                            label="+"
                                            onClick={() =>
                                                setQuantity((current) =>
                                                    Math.min(
                                                        product.stock || 1,
                                                        current + 1,
                                                    )
                                                )
                                            }
                                            disabled={quantity >= product.stock}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-gray-500">
                                        ເຫຼືອພຽງ {product.stock} ຊິ້ນ
                                    </span>
                                </div>

                                {message ? (
                                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-shop-primary">
                                        {message}
                                    </div>
                                ) : null}

                                <div className="mt-7 grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                        className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-shop-primary bg-white px-4 text-sm font-black text-shop-primary transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:h-14 md:text-base"
                                    >
                                        <CircleIcon type="cart" />
                                        ເພີ່ມລົງກະຕ່າ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        disabled={product.stock <= 0}
                                        className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-shop-primary px-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(229,57,53,0.22)] transition hover:bg-shop-secondary disabled:cursor-not-allowed disabled:opacity-50 md:h-14 md:text-base"
                                    >
                                        ⚡
                                        ສັ່ງຊື້ເລີຍ
                                    </button>
                                </div>

                                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                                    {servicePoints.map((item) => (
                                        <div
                                            key={item.title}
                                            className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left"
                                        >
                                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gray-50 text-shop-text">
                                                <ServiceIcon type={item.icon} />
                                            </span>
                                            <span className="mt-2 md:ml-3 md:mt-0">
                                                <span className="block text-xs font-black text-shop-text md:text-sm">
                                                    {item.title}
                                                </span>
                                                <span className="mt-1 hidden text-xs font-semibold text-gray-500 md:block">
                                                    {item.text}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
