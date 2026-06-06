import { HeaderActions } from './header/HeaderActions'
import { HeaderLogo } from './header/HeaderLogo'
import { HeaderNav } from './header/HeaderNav'
import { HeaderSearch } from './header/HeaderSearch'
import { SearchIcon } from './header/icons'

type HomeHeaderProps = {
  activePage?: 'home' | 'products' | 'stores' | 'orders'
}

export function HomeHeader({ activePage = 'home' }: HomeHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-x-hidden border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[220px_minmax(280px,1fr)_220px] items-center gap-5 max-lg:grid-cols-[auto_1fr_auto] max-sm:gap-2">
          <HeaderLogo />

          <div className="hidden justify-self-center md:flex md:w-full md:max-w-2xl">
            <HeaderSearch id="site-search" />
          </div>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                window.location.hash = "#/search-entry"
              }}
              className="grid h-10 w-10 place-items-center rounded-full text-shop-text transition hover:bg-shop-light md:hidden"
              aria-label="ຄົ້ນຫາ"
            >
              <SearchIcon />
            </button>
            <HeaderActions />
          </div>
        </div>

        <div className="hidden md:block">
          <HeaderNav activePage={activePage} />
        </div>
      </div>
    </header>
  )
}
