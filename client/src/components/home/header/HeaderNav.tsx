import { HomeIcon } from './icons'

const navItems = [
  { label: 'ໜ້າຫຼັກ', href: '#home', active: true },
  { label: 'ໝວດໝູ່', href: '#categories' },
  { label: 'ກ່ຽວກັບເຮົາ', href: '#about' },
  { label: 'ຕິດຕໍ່ເຮົາ', href: '#contact' },
]

export function HeaderNav() {
  return (
    <nav className="flex h-10 items-center justify-center gap-10 overflow-x-auto text-sm font-semibold">
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`relative flex h-full min-w-20 shrink-0 items-center justify-center gap-1 px-1 transition after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-12 after:-translate-x-1/2 after:rounded-full after:content-[''] ${
            item.active
              ? 'text-shop-primary after:bg-shop-primary'
              : 'text-shop-text after:bg-transparent hover:text-shop-primary'
          }`}
        >
          {item.label === 'ໜ້າຫຼັກ' ? <HomeIcon /> : null}
          {item.label}
        </a>
      ))}
    </nav>
  )
}
