import type { ReactNode } from "react";
import { AuthBrandPanel } from "./AuthBrandPanel";

type AuthShellProps = {
    mode: "login" | "register";
    children: ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
    return (
        <main className="min-h-screen bg-[#fff8f5] px-4 py-5 text-shop-text sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[390px] overflow-hidden rounded-[28px] border border-red-100 bg-white shadow-[0_18px_55px_rgba(51,51,51,0.10)] lg:grid lg:max-w-6xl lg:rounded-2xl lg:grid-cols-[1.08fr_1fr]">
                <div className="hidden lg:block">
                    <AuthBrandPanel mode={mode} />
                </div>
                <section className="flex w-full items-center justify-center bg-white px-5 py-5 sm:px-7 lg:px-10 lg:py-8">
                    {children}
                </section>
            </div>
        </main>
    );
}
