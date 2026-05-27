import { CircleIcon } from './icons'

export function HeaderActions() {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 text-shop-text">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
        aria-label="ຂໍ້ຄວາມ"
      >
        <CircleIcon type="chat" />
      </button>
      <button
        type="button"
        className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
        aria-label="ກະຕ່າສິນຄ້າ"
      >
        <CircleIcon type="cart" />
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-shop-primary px-1 text-[10px] font-bold leading-none text-white">
          3
        </span>
      </button>
      <button
        type="button"
        className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-shop-light sm:flex"
      >
        <CircleIcon type="user" />
        ເຂົ້າລະບົບ
      </button>
    </div>
  )
}
