import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { getAuthUser, logout } from "../lib/auth";


const text = {
    title: "\u0ec2\u0e9b\u0ea3\u0ec4\u0e9f\u0ea5\u0ecc\u0e82\u0ead\u0e87\u0e82\u0ec9\u0ead\u0e8d",
    subtitle:
        "\u0e88\u0eb1\u0e94\u0e81\u0eb2\u0e99\u0e82\u0ecd\u0ec9\u0ea1\u0eb9\u0e99\u0eaa\u0ec8\u0ea7\u0e99\u0e95\u0ebb\u0ea7 \u0ec1\u0ea5\u0eb0 \u0e81\u0eb2\u0e99\u0e95\u0eb1\u0ec9\u0e87\u0e84\u0ec8\u0eb2\u0e9a\u0eb1\u0e99\u0e8a\u0eb5\u0e82\u0ead\u0e87\u0e97\u0ec8\u0eb2\u0e99",
    member: "\u0eaa\u0eb0\u0ea1\u0eb2\u0e8a\u0eb4\u0e81\u0e97\u0ebb\u0ec8\u0ea7\u0ec4\u0e9b",
    joined: "\u0ec0\u0e82\u0ebb\u0ec9\u0eb2\u0eae\u0ec8\u0ea7\u0ea1\u0ec0\u0ea1\u0eb7\u0ec8\u0ead 1 \u0ea1.\u0e81. 2568",
    editProfile: "\u0ec1\u0e81\u0ec9\u0ec4\u0e82\u0ec2\u0e9b\u0ea3\u0ec4\u0e9f\u0ea5\u0ecc",
    personalInfo: "\u0e82\u0ecd\u0ec9\u0ea1\u0eb9\u0e99\u0eaa\u0ec8\u0ea7\u0e99\u0e95\u0ebb\u0ea7",
    fullName: "\u0e8a\u0eb7\u0ec8-\u0e99\u0eb2\u0ea1\u0eaa\u0eb0\u0e81\u0eb8\u0e99",
    phone: "\u0ec0\u0e9a\u0eb5\u0ec2\u0e97\u0ea5\u0eb0\u0eaa\u0eb1\u0e9a",
    email: "\u0ead\u0eb5\u0ec0\u0ea1\u0ea7",
    password: "\u0ea5\u0eb0\u0eab\u0eb1\u0e94\u0e9c\u0ec8\u0eb2\u0e99",
    birthday: "\u0ea7\u0eb1\u0e99\u0ec0\u0e81\u0eb5\u0e94",
    gender: "\u0ec0\u0e9e\u0e94",
    male: "\u0e8a\u0eb2\u0e8d",
    edit: "\u0ec1\u0e81\u0ec9\u0ec4\u0e82",
    defaultName: "\u0eaa\u0eb0\u0e9a\u0eb2\u0e8d\u0e94\u0eb5 \u0ec4\u0e8a\u0e94\u0eb5",
    logout: "\u0ead\u0ead\u0e81\u0e88\u0eb2\u0e81\u0ea5\u0eb0\u0e9a\u0ebb\u0e9a",
};



function CameraIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M8 7 9.5 5h5L16 7h3v12H5V7zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function CrownIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="m4 8 4 4 4-7 4 7 4-4-1.5 9h-13z" fill="currentColor" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M7 4h4l1 5-2.5 1.5A11 11 0 0 0 14 15l1.5-2.5 5 1v4c0 1.1-.9 2-2 2A15.5 15.5 0 0 1 5 6c0-1.1.9-2 2-2Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M4 6h16v12H4zM4 7l8 6 8-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M7 4v3M17 4v3M5 8h14M6 6h12v14H6z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10zM14 7l3 3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M10 6H6v12h4M14 8l4 4-4 4M8 12h10"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <path
                d="m9 6 6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
            />
        </svg>
    );
}

function UserAvatar() {
    return (
        <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/20 bg-white shadow-[inset_0_0_0_11px_rgba(255,238,238,0.75)] md:h-24 md:w-24 md:shadow-[inset_0_0_0_16px_rgba(255,238,238,0.75)]">
            <svg viewBox="0 0 96 96" className="h-11 w-11 md:h-16 md:w-16" aria-hidden="true">
                <defs>
                    <linearGradient id="account-avatar" x1="20" x2="78" y1="16" y2="82">
                        <stop stopColor="#ff8e9b" />
                        <stop offset="1" stopColor="#ef232a" />
                    </linearGradient>
                </defs>
                <circle cx="48" cy="33" r="15" fill="url(#account-avatar)" />
                <path
                    d="M22 78c3-18 13-27 26-27s23 9 26 27"
                    fill="url(#account-avatar)"
                />
            </svg>
            <button
                type="button"
                className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border border-white bg-white text-shop-primary shadow-[0_4px_10px_rgba(0,0,0,0.1)] md:bottom-0.5 md:right-0.5 md:h-8 md:w-8"
                aria-label="Change profile photo"
            >
                <CameraIcon />
            </button>
        </div>
    );
}



type ProfileCardProps = {
    email: string;
    name: string;
};

function ProfileCard({ email, name }: ProfileCardProps) {
    return (
        <section className="relative overflow-hidden rounded-[20px] border border-red-100/50 bg-gradient-to-br from-[#fff5f6] via-white to-[#fff8f9] p-4 sm:p-5 text-shop-text shadow-[0_10px_25px_rgba(229,57,53,0.03)] md:rounded-2xl md:p-8">
            {/* Elegant glassmorphic background layers */}
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-red-500/3 pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-red-500/3 pointer-events-none" />
            
            <div className="absolute inset-y-0 right-0 hidden w-80 opacity-40 md:block pointer-events-none">
                <div className="absolute bottom-7 right-14 h-24 w-24 rounded-2xl bg-red-500/3" />
                <div className="absolute bottom-10 right-36 h-16 w-16 rounded-full bg-red-500/5" />
                <div className="absolute right-16 top-12 h-20 w-32 rounded-t-2xl border-t-[18px] border-red-100/20 bg-red-100/10" />
            </div>

            <div className="relative flex items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-4 md:gap-8 min-w-0 flex-1">
                    <UserAvatar />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h2 className="truncate text-base sm:text-lg md:text-2xl font-black text-shop-text leading-tight">
                                {name}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black text-shop-primary border border-red-100/30 shadow-xs md:px-3 md:text-xs">
                                <span className="text-amber-500 shrink-0"><CrownIcon /></span>
                                {text.member}
                            </span>
                        </div>
                        <div className="mt-2 space-y-1 text-[11px] sm:text-xs md:text-sm font-semibold text-gray-500 md:mt-3 md:space-y-1.5">
                            <p className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="text-gray-400"><PhoneIcon /></span>
                                020 1234 5678
                            </p>
                            <p className="hidden items-center gap-1.5 md:flex">
                                <span className="text-gray-400"><MailIcon /></span>
                                {email}
                            </p>
                            <p className="hidden items-center gap-1.5 md:flex">
                                <span className="text-gray-400"><CalendarIcon /></span>
                                {text.joined}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <a
                        href="#/account/edit"
                        className="hidden h-10 items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 text-xs font-black text-shop-text transition hover:border-shop-primary hover:text-shop-primary hover:bg-shop-light/30 md:inline-flex shadow-xs"
                    >
                        <EditIcon />
                        {text.editProfile}
                    </a>
                    <a 
                        href="#/account/edit" 
                        className="shrink-0 text-gray-400 hover:text-shop-primary transition md:hidden p-3 -mr-3 cursor-pointer" 
                        aria-label="Edit profile"
                    >
                        <ChevronRightIcon />
                    </a>
                </div>
            </div>
        </section>
    );
}

function InfoCell({
    label,
    value,
    canEdit = true,
}: {
    label: string;
    value: string;
    canEdit?: boolean;
}) {
    return (
        <div className="flex min-h-16 items-center justify-between gap-4 border-gray-100 px-5 py-3 md:border-r">
            <div>
                <p className="text-xs font-semibold text-gray-500">{label}</p>
                <p className="mt-1 text-sm font-black text-shop-text">{value}</p>
            </div>
            {canEdit ? (
                <button
                    type="button"
                    className="h-10 rounded-xl border border-gray-200 px-4 text-xs font-black text-shop-text transition hover:border-shop-primary hover:text-shop-primary"
                >
                    {text.edit}
                </button>
            ) : null}
        </div>
    );
}

function DesktopDetails({ email, name }: ProfileCardProps) {
    return (
        <section className="hidden rounded-xl border border-gray-100 bg-white shadow-[0_14px_40px_rgba(51,51,51,0.06)] md:block">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 text-shop-text">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    />
                </svg>
                <h2 className="text-base font-black">{text.personalInfo}</h2>
            </div>
            <div className="grid overflow-hidden rounded-b-xl md:grid-cols-3">
                <InfoCell label={text.fullName} value={name} />
                <InfoCell label={text.phone} value="020 1234 5678" />
                <InfoCell label={text.email} value={email} />
                <InfoCell label={text.password} value="********" />
                <InfoCell label={text.birthday} value="1 \u0e21.\u0e04. 2535" />
                <InfoCell label={text.gender} value={text.male} />
            </div>
        </section>
    );
}

export function AccountPage() {
    const user = getAuthUser();
    const name = user?.name || text.defaultName;
    const email = user?.email || "sabaidee@example.com";

    const handleLogout = () => {
        logout();
        window.location.assign("#home");
    };

    return (
        <main className="min-h-screen bg-white pb-28 pt-[70px] text-shop-text md:bg-[#fbfbfc] md:pb-12 md:pt-28">
            <HomeHeader activePage="account" title="ບັນຊີ" hideSearch />

            <section className="mx-auto max-w-7xl px-5 pt-6 md:px-8 md:pt-0">
                <div className="hidden md:block">
                    <h1 className="text-3xl font-black text-shop-text">{text.title}</h1>
                    <p className="mt-2 text-sm font-semibold text-gray-500">
                        {text.subtitle}
                    </p>
                </div>

                <div className="mt-0 md:mt-8">
                    <ProfileCard email={email} name={name} />
                </div>

                <div className="mt-5">
                    <DesktopDetails email={email} name={name} />
                </div>
            </section>

            <div className="fixed inset-x-5 bottom-24 z-50 md:hidden">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white text-sm font-black text-shop-primary shadow-[0_10px_30px_rgba(51,51,51,0.08)]"
                >
                    <LogoutIcon />
                    {text.logout}
                </button>
            </div>

            <MobileBottomNav activePage="account" />
        </main>
    );
}
