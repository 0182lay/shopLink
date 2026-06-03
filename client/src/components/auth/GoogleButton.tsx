type GoogleButtonProps = {
    label: string;
};

export function GoogleButton({ label }: GoogleButtonProps) {
    return (
        <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-shop-text transition hover:border-red-200 hover:bg-shop-light/40 sm:h-11 sm:text-sm"
        >
            <span className="text-lg font-black text-shop-primary">G</span>
            {label}
        </button>
    );
}
