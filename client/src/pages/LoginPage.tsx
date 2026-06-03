import { useEffect, useState, type FormEvent } from "react";
import homeImage from "../assets/images/home/homeimg.png";
import { AuthDivider } from "../components/auth/AuthDivider";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthLogo } from "../components/auth/AuthLogo";
import { AuthShell } from "../components/auth/AuthShell";
import { GoogleButton } from "../components/auth/GoogleButton";
import { api } from "../lib/api";
import { saveAuthSession } from "../lib/auth";

function BackLink() {
    return (
        <a
            href="#home"
            className="absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full text-shop-text transition hover:bg-shop-light"
            aria-label="ກັບໜ້າຫຼັກ"
        >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                    d="m15 6-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </svg>
        </a>
    );
}

function EyeButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="grid h-7 w-7 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-shop-primary"
            aria-label={visible ? "ເຊື່ອງລະຫັດຜ່ານ" : "ສະແດງລະຫັດຜ່ານ"}
        >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                    d={
                        visible
                            ? "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Zm9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            : "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Zm4-7 10 14"
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                />
            </svg>
        </button>
    );
}

function LoginIntro() {
    return (
        <div className="relative text-center">
            <BackLink />
            <div className="flex justify-center">
                <AuthLogo />
            </div>
            <div className="pointer-events-none absolute left-10 top-24 h-4 w-4 rounded-full bg-[#ffd8cf]" />
            <div className="pointer-events-none absolute right-8 top-28 h-5 w-5 rounded-full bg-[#ffd8cf]" />
            <h1 className="mt-5 text-xl font-black text-shop-text">
                ຍິນດີຕ້ອນຮັບກັບ
            </h1>
            <p className="mt-1 text-xs font-medium text-gray-500">
                ເຂົ້າສູ່ລະບົບເພື່ອຈັດການຮ້ານຄ້າ
            </p>
            <img
                src={homeImage}
                alt=""
                className="mx-auto mt-4 h-20 w-full object-contain lg:h-28"
            />
        </div>
    );
}

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const authMessage = sessionStorage.getItem("authMessage");

        if (authMessage) {
            setMessage({ type: "success", text: authMessage });
            sessionStorage.removeItem("authMessage");
        }
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);

        try {
            setIsSubmitting(true);
            const response = await api.login({
                email: email.trim(),
                password,
            });

            if (response.token) {
                saveAuthSession(response.token, response.data, rememberMe);
            }

            window.location.hash = "#home";
        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell mode="login">
            <div className="w-full max-w-sm lg:max-w-md">
                <form
                    className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-8 lg:shadow-[0_14px_40px_rgba(51,51,51,0.08)]"
                    onSubmit={handleSubmit}
                >
                    <LoginIntro />

                    <div className="mt-5 space-y-4">
                        <AuthInput
                            label="ອີເມວ"
                            placeholder="ກອກອີເມວຂອງທ່ານ"
                            type="email"
                            autoComplete="email"
                            icon="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <AuthInput
                            label="ລະຫັດຜ່ານ"
                            placeholder="ກອກລະຫັດຜ່ານຂອງທ່ານ"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            icon="lock"
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            action={
                                <EyeButton
                                    visible={showPassword}
                                    onClick={() => setShowPassword((value) => !value)}
                                />
                            }
                        />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-shop-primary focus:ring-shop-primary"
                            />
                            ຈື່ຂ້ອຍ
                        </label>
                        <button
                            type="button"
                            className="text-xs font-bold text-shop-primary hover:text-shop-secondary"
                        >
                            ລືມລະຫັດຜ່ານ?
                        </button>
                    </div>

                    {message ? (
                        <div
                            className={`mt-3 rounded-lg border px-3 py-2 text-xs font-bold leading-5 ${
                                message.type === "success"
                                    ? "border-green-100 bg-green-50 text-green-700"
                                    : "border-red-100 bg-red-50 text-shop-primary"
                            }`}
                        >
                            {message.text}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-5 h-10 w-full rounded-lg bg-shop-primary text-sm font-black text-white shadow-[0_10px_22px_rgba(229,57,53,0.24)] transition hover:bg-shop-secondary disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
                    >
                        {isSubmitting ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
                    </button>

                    <div className="my-5">
                        <AuthDivider />
                    </div>

                    <GoogleButton label="ເຂົ້າສູ່ລະບົບດ້ວຍ Google" />

                    <p className="mt-5 text-center text-xs font-medium text-gray-600">
                        ຍັງບໍ່ມີບັນຊີ?{" "}
                        <a href="#/register" className="font-black text-shop-primary">
                            ສະໝັກສະມາຊິກ
                        </a>
                    </p>
                </form>
            </div>
        </AuthShell>
    );
}
