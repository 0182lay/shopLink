import { HeaderActions } from "./header/HeaderActions";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderNav } from "./header/HeaderNav";
import { HeaderSearch } from "./header/HeaderSearch";
import { SearchIcon } from "./header/icons";

type HomeHeaderProps = {
    activePage?: "home" | "products" | "stores" | "orders" | "account";
    title?: string;
    hideSearch?: boolean;
};

export function HomeHeader({ activePage = "home", title, hideSearch = false }: HomeHeaderProps) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 overflow-visible border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                {/* Desktop Grid Header */}
                <div className="hidden md:grid h-16 grid-cols-[220px_minmax(280px,1fr)_220px] items-center gap-5">
                    <HeaderLogo />

                    <div className="flex justify-self-center w-full max-w-2xl justify-center">
                        {hideSearch && title ? (
                            <span className="text-lg font-black text-shop-text">
                                {title}
                            </span>
                        ) : (
                            !hideSearch && <HeaderSearch id="site-search" />
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-1">
                        <HeaderActions />
                    </div>
                </div>

                {/* Mobile Flex Header */}
                <div className="flex md:hidden h-16 items-center justify-between relative">
                    {title ? (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-black text-shop-text whitespace-nowrap">
                            {title}
                        </div>
                    ) : (
                        <HeaderLogo />
                    )}

                    {title && <div className="w-10 h-10" />}

                    <div className="flex items-center justify-end gap-1 ml-auto">
                        {!hideSearch && (
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.hash = "#/search-entry";
                                }}
                                className="grid h-10 w-10 place-items-center rounded-full text-shop-text transition hover:bg-shop-light"
                                aria-label="ຄົ້ນຫາ"
                            >
                                <SearchIcon />
                            </button>
                        )}
                        <HeaderActions />
                    </div>
                </div>

                <div className="hidden md:block">
                    <HeaderNav activePage={activePage} />
                </div>
            </div>
        </header>
    );
}
