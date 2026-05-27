import { HeaderActions } from './header/HeaderActions'
import { HeaderLogo } from './header/HeaderLogo'
import { HeaderNav } from './header/HeaderNav'
import { HeaderSearch } from './header/HeaderSearch'

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[220px_minmax(280px,1fr)_220px] items-center gap-5 max-lg:grid-cols-[auto_1fr_auto]">
          <HeaderLogo />

          <div className="hidden justify-self-center md:flex md:w-full md:max-w-2xl">
            <HeaderSearch id="site-search" />
          </div>

          <HeaderActions />
        </div>

        <div className="mb-3 md:hidden">
          <HeaderSearch id="mobile-search" compact />
        </div>

        <HeaderNav />
      </div>
    </header>
  )
}
