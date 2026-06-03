import type { ChangeEvent, ReactNode } from "react";

type AuthInputProps = {
    label: string;
    placeholder: string;
    type?: string;
    autoComplete?: string;
    icon?: "user" | "email" | "lock";
    action?: ReactNode;
    name?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

const iconPaths = {
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
    email: "M4 6h16v12H4z M4 7l8 6 8-6",
    lock: "M7 10V8a5 5 0 0 1 10 0v2 M6 10h12v10H6z",
};

export function AuthInput({
    label,
    placeholder,
    type = "text",
    autoComplete,
    icon,
    action,
    name,
    value,
    onChange,
    required,
}: AuthInputProps) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-shop-text sm:text-sm">
                {label}
            </span>
            <span className="relative block">
                {icon ? (
                    <svg
                        viewBox="0 0 24 24"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4"
                        aria-hidden="true"
                    >
                        <path
                            d={iconPaths[icon]}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                        />
                    </svg>
                ) : null}
                <input
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`h-10 w-full rounded-lg border border-gray-200 bg-white text-xs font-medium text-shop-text outline-none transition placeholder:text-gray-400 focus:border-shop-primary focus:ring-4 focus:ring-red-100 sm:h-11 sm:text-sm ${
                        icon ? "pl-9 sm:pl-11" : "pl-3 sm:pl-4"
                    } ${action ? "pr-11 sm:pr-12" : "pr-3 sm:pr-4"}`}
                />
                {action ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {action}
                    </span>
                ) : null}
            </span>
        </label>
    );
}
