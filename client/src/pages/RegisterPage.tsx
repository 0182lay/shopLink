import { useState, type FormEvent } from "react";
import { AuthDivider } from "../components/auth/AuthDivider";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthLogo } from "../components/auth/AuthLogo";
import { AuthShell } from "../components/auth/AuthShell";
import { GoogleButton } from "../components/auth/GoogleButton";
import { api } from "../lib/api";

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

export function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({
                type: "error",
                text: "ລະຫັດຜ່ານ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ",
            });
            return;
        }

        if (password.length < 6) {
            setMessage({
                type: "error",
                text: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ",
            });
            return;
        }

        if (!acceptedTerms) {
            setMessage({
                type: "error",
                text: "ກະລຸນາຍອມຮັບຂໍ້ຕົກລົງກ່ອນສະໝັກສະມາຊິກ",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await api.register({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            sessionStorage.setItem(
                "authMessage",
                "ສະໝັກສະມາຊິກສຳເລັດ ກະລຸນາເຂົ້າສູ່ລະບົບ",
            );
            window.location.hash = "#/login";
        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "ສະໝັກສະມາຊິກບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell mode="register">
            <div className="w-full max-w-sm lg:max-w-md">
                <form
                    className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-8 lg:shadow-[0_14px_40px_rgba(51,51,51,0.08)]"
                    onSubmit={handleSubmit}
                >
                    <div className="relative text-center">
                        <BackLink />
                        <div className="flex justify-center">
                            <AuthLogo />
                        </div>
                        <h1 className="mt-5 text-xl font-black text-shop-text">
                            ສ້າງບັນຊີໃໝ່
                        </h1>
                        <p className="mt-1 text-xs font-medium text-gray-500">
                            ກອກຂໍ້ມູນເພື່ອສ້າງບັນຊີຜູ້ໃຊ້ງານ
                        </p>
                    </div>

                    <div className="mt-5 space-y-3.5">
                        <AuthInput
                            label="ຊື່-ນາມສະກຸນ"
                            placeholder="ກອກຊື່-ນາມສະກຸນ"
                            autoComplete="name"
                            icon="user"
                            name="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
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
                            autoComplete="new-password"
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
                        <AuthInput
                            label="ຢືນຢັນລະຫັດຜ່ານ"
                            placeholder="ກອກລະຫັດຜ່ານອີກຄັ້ງ"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            icon="lock"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            action={
                                <EyeButton
                                    visible={showConfirmPassword}
                                    onClick={() =>
                                        setShowConfirmPassword((value) => !value)
                                    }
                                />
                            }
                        />
                    </div>

                    <label className="mt-3 flex items-start gap-2 text-[11px] font-semibold leading-5 text-gray-600">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(event) => setAcceptedTerms(event.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-shop-primary focus:ring-shop-primary"
                        />
                        <span>
                            ຂ້ອຍຍອມຮັບ{" "}
                            <button type="button" className="font-black text-shop-primary">
                                ຂໍ້ຕົກລົງການໃຊ້ງານ
                            </button>{" "}
                            ແລະ{" "}
                            <button type="button" className="font-black text-shop-primary">
                                ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ
                            </button>
                        </span>
                    </label>

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
                        className="mt-4 h-10 w-full rounded-lg bg-shop-primary text-sm font-black text-white shadow-[0_10px_22px_rgba(229,57,53,0.24)] transition hover:bg-shop-secondary sm:h-11"
                    >
                        {isSubmitting ? "ກຳລັງສະໝັກ..." : "ສະໝັກສະມາຊິກ"}
                    </button>

                    <div className="my-4">
                        <AuthDivider />
                    </div>

                    <GoogleButton label="ສະໝັກດ້ວຍ Google" />

                    <p className="mt-4 text-center text-xs font-medium text-gray-600">
                        ມີບັນຊີຢູ່ແລ້ວ?{" "}
                        <a href="#/login" className="font-black text-shop-primary">
                            ເຂົ້າສູ່ລະບົບ
                        </a>
                    </p>
                </form>
            </div>
        </AuthShell>
    );
}
