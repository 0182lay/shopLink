import { useEffect, useState } from "react";
import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { useOrders, type Order, type OrderStatus, type CheckoutCustomer } from "../lib/orders";
import { api, type BackendOrder } from "../lib/api";
import { getAuthUser } from "../lib/auth";


const formatDate = (date: string) => {
    try {
        return new Intl.DateTimeFormat("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(date));
    } catch (e) {
        return date;
    }
};

const mapStatus = (status: string): OrderStatus => {
    const lower = status.toLowerCase();
    if (lower === "confirmed" || lower === "shipping" || lower === "completed") {
        return "confirmed";
    }
    if (lower === "cancelled") {
        return "cancelled";
    }
    return "pending";
};

// Helper Icons
function PackageIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function PriceIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8c-1.5 0-2 .8-2 1.5s.5 1.5 2 2 2 .8 2 1.5-.5 1.5-2 1.5-2-.8-2-1.5" />
            <path d="M12 6v12" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

// Helpers
const formatOrderId = (id: string | number, dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;
    const idPart = String(id).padStart(5, "0");
    return `#RB-${datePart}-${idPart}`;
};

const getShippingInfo = (orderId: string | number) => {
    const idStr = String(orderId);
    if (idStr.endsWith("125") || idStr === "125") {
        return {
            company: "Anousith Express",
            tracking: "AE123456789",
            hasLabel: true,
        };
    }
    if (idStr.endsWith("123") || idStr === "123") {
        return {
            company: "Kerry Express",
            tracking: "KE987654321TH",
            hasLabel: true,
        };
    }
    const numId = Number(orderId) || 0;
    const isEven = numId % 2 === 0;
    return {
        company: isEven ? "Anousith Express" : "Kerry Express",
        tracking: isEven 
            ? `AE${String(123450000 + numId).substring(0, 9)}`
            : `KE${String(987650000 + numId).substring(0, 9)}TH`,
        hasLabel: numId % 3 !== 0,
    };
};

const getFullAddress = (cust?: CheckoutCustomer) => {
    if (!cust) return "";
    const parts = [cust.province, cust.district, cust.village, cust.address].filter(Boolean);
    return parts.join(", ");
};

// Modals
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
    const orderIdFormatted = formatOrderId(order.id, order.createdAt);
    
    const statusConfig = {
        pending: {
            label: "ລໍຖ້າຢືນຢັນ",
            colorClass: "bg-amber-50 text-amber-700 border-amber-200"
        },
        confirmed: {
            label: "ຢືນຢັນແລ້ວ",
            colorClass: "bg-green-50 text-green-700 border-green-200"
        },
        cancelled: {
            label: "ຍົກເລີກ",
            colorClass: "bg-red-50 text-red-700 border-red-200"
        }
    };
    const currentStatus = statusConfig[order.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl transition-all flex flex-col max-h-[85vh] animate-scale-up">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-black text-shop-text">{orderIdFormatted}</h3>
                        <p className="text-xs text-gray-500 font-bold">{order.storeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-shop-primary transition"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-5 font-semibold">
                    
                    {/* Status & Date */}
                    <div className="flex items-center justify-between bg-gray-50/70 p-3 rounded-xl border border-gray-100/50">
                        <div className="text-xs font-bold text-gray-500">
                            <span>ສະຖານະ: </span>
                            <span className={`inline-block rounded-full border px-2 py-0.5 ml-1 text-xs font-black ${currentStatus.colorClass}`}>
                                {currentStatus.label}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 font-semibold">
                            {formatDate(order.createdAt)}
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">ລາຍການສິນຄ້າ</h4>
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
                            {order.items.map((item) => (
                                <div key={item.productId} className="p-3 flex items-center gap-3">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                                        />
                                    ) : (
                                        <span className="grid h-12 w-12 place-items-center rounded-lg bg-shop-light text-shop-primary">
                                            <PackageIcon />
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 text-sm font-black text-shop-text">
                                            {item.name}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-500">
                                            LAK {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-shop-text">x{item.quantity}</p>
                                        <p className="text-xs font-black text-shop-primary mt-0.5">
                                            LAK {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.customer && (
                        <div className="rounded-xl border border-gray-100 p-4 space-y-2.5 bg-gray-50/20">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">ຂໍ້ມູນຜູ້ຮັບ & ທີ່ຢູ່ຈັດສົ່ງ</h4>
                            
                            <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5 text-xs">
                                <span className="font-semibold text-gray-400">ຊື່ຜູ້ຮັບ:</span>
                                <span className="font-black text-gray-700">{order.customer.name}</span>
                                
                                <span className="font-semibold text-gray-400">ເเบີໂທລະສັບ:</span>
                                <span className="font-black text-gray-700">{order.customer.phone}</span>
                                
                                <span className="font-semibold text-gray-400">ທີ່ຢູ່ຈັດສົ່ງ:</span>
                                <span className="font-bold text-gray-700 leading-relaxed">
                                    {getFullAddress(order.customer)}
                                </span>

                                {order.customer.note && (
                                    <>
                                        <span className="font-semibold text-gray-400">ໝາຍເຫດ:</span>
                                        <span className="font-semibold text-shop-primary italic">"{order.customer.note}"</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pricing Summary */}
                    <div className="rounded-xl border border-gray-100 p-4 space-y-1.5 bg-white">
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                            <span>ລວມຄ່າສິນຄ້າ</span>
                            <span>LAK {order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                            <span>ຄ່າຈັດສົ່ງ</span>
                            <span>{order.customer?.shipping ? `LAK 0 (ຫຼື ຕາມຕົວຈິງ)` : "LAK 0 (ຟຣີ)"}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-gray-100 pt-2 text-sm font-black text-shop-text">
                            <span>ຍອດລວມທັງໝົດ</span>
                            <span className="text-shop-primary">LAK {order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShippingLabelModal({ order, onClose, onCopy }: { order: Order; onClose: () => void; onCopy: (text: string) => void }) {
    const orderIdFormatted = formatOrderId(order.id, order.createdAt);
    const shipping = getShippingInfo(order.id);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl transition-all flex flex-col animate-scale-up">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div>
                        <h3 className="text-sm font-black text-shop-text">ໃບຝາກສົ່ງ</h3>
                        <p className="text-xs text-gray-500 font-bold">{orderIdFormatted}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-shop-primary transition"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <img 
                        src="/shipping-label.png" 
                        alt="Shipping Label" 
                        className="w-full max-h-[350px] object-contain rounded-lg shadow-sm bg-white" 
                    />
                    
                    <div className="w-full text-center space-y-1">
                        <p className="text-xs font-bold text-gray-500">{shipping.company}</p>
                        <p className="text-sm font-black text-shop-text font-mono tracking-wider">{shipping.tracking}</p>
                    </div>
                </div>
                
                <button
                    onClick={() => {
                        onCopy(shipping.tracking);
                    }}
                    className="mt-4 w-full h-11 rounded-xl bg-shop-primary text-white text-xs font-black transition hover:bg-shop-secondary"
                >
                    ຄັດລອກເລກພັດສະດຸ
                </button>
            </div>
        </div>
    );
}

function OrderCard({ 
    order, 
    onViewDetails, 
    onViewLabel,
    onCopy
}: { 
    order: Order; 
    onViewDetails: (order: Order) => void; 
    onViewLabel: (order: Order) => void;
    onCopy: (text: string) => void;
}) {
    const shipping = getShippingInfo(order.id);
    const orderIdFormatted = formatOrderId(order.id, order.createdAt);
    
    const statusConfig = {
        pending: {
            label: "รอยืนยัน",
            colorClass: "bg-amber-50 text-amber-600 border-transparent",
            icon: (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 mr-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            )
        },
        confirmed: {
            label: "ยืนยันแล้ว",
            colorClass: "bg-[#e6f7ed] text-[#0fa958] border-transparent",
            icon: (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 mr-1 text-[#0fa958] shrink-0" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
            )
        },
        cancelled: {
            label: "ยกเลิก",
            colorClass: "bg-red-50 text-red-500 border-transparent",
            icon: (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 mr-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            )
        }
    };

    const currentStatus = statusConfig[order.status];

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(51,51,51,0.02)] transition hover:shadow-[0_8px_24px_rgba(51,51,51,0.06)] relative">
            <div className="grid grid-cols-[1.3fr_1.7fr] gap-2 items-stretch">
                
                {/* Left Column: ID, Shop, items count, total, date */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-0.5 sm:space-y-1">
                        <h2 className="text-[11px] sm:text-sm md:text-base font-black text-shop-text tracking-tight truncate" title={orderIdFormatted}>
                            {orderIdFormatted}
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-gray-500 pb-0.5 truncate">
                            {order.storeName}
                        </p>
                        
                        <div className="flex flex-col gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-semibold text-gray-500">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <PackageIcon />
                                <span className="truncate">{order.items.reduce((sum, item) => sum + item.quantity, 0)} รายการสินค้า</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5 font-black text-red-500">
                                <PriceIcon />
                                <span>LAK {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400 text-[9px] sm:text-xs font-semibold mt-2 shrink-0">
                        <CalendarIcon />
                        <span className="truncate">{formatDate(order.createdAt)}</span>
                    </div>
                </div>

                {/* Right Container: Top (Middle/Right Cols) and Bottom (Action Buttons) */}
                <div className="flex flex-col justify-between">
                    {/* Top Row: Middle Column & Right Column */}
                    <div className="grid grid-cols-[1.1fr_0.9fr] gap-1.5 items-start">
                        {/* Middle Column */}
                        <div className="space-y-1.5">
                            <div>
                                <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-xs font-black ${currentStatus.colorClass}`}>
                                    {currentStatus.icon}
                                    <span>{currentStatus.label}</span>
                                </div>
                            </div>

                            {order.status === "confirmed" && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-black text-gray-500">
                                        <TruckIcon />
                                        <span className="truncate">{shipping.company}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f7ed] py-0.5 px-2 text-[9px] sm:text-xs font-bold text-gray-700 w-fit max-w-full">
                                        <span className="font-mono tracking-tight truncate">{shipping.tracking}</span>
                                        <button 
                                            onClick={() => onCopy(shipping.tracking)}
                                            className="p-0.5 rounded-md text-gray-400 hover:text-shop-primary transition cursor-pointer shrink-0"
                                            title="คัดลอกเลขพัสดุ"
                                        >
                                            <CopyIcon />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {order.status === "pending" && (
                                <div className="rounded-lg bg-amber-50 p-1.5 text-[8px] sm:text-[10px] font-semibold text-amber-700 flex items-start gap-1 max-w-full leading-snug">
                                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12" y2="16" />
                                    </svg>
                                    <span>ร้านค้าจะยืนยันคำสั่งซื้อภายใน 24 ชั่วโมง</span>
                                </div>
                            )}

                            {order.status === "cancelled" && (
                                <div className="rounded-lg bg-red-50 p-1.5 text-[8px] sm:text-[10px] font-semibold text-red-700 flex items-start gap-1 max-w-full leading-snug">
                                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-red-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12" y2="16" />
                                    </svg>
                                    <span>เหตุผลในการยกเลิก: สินค้าหมด</span>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Barcode thumbnail, ดูใบฝากส่ง, and right Chevron */}
                        <div className="flex items-center gap-1.5 justify-end w-full min-h-[50px]">
                            {order.status === "confirmed" && shipping.hasLabel ? (
                                <div className="flex flex-col items-center gap-0.5 shrink-0">
                                    <button 
                                        onClick={() => onViewLabel(order)}
                                        className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white p-0.5 hover:border-shop-primary transition cursor-pointer shadow-sm shrink-0"
                                    >
                                        <img 
                                            src="/shipping-label.png" 
                                            alt="Shipping Barcode" 
                                            className="h-8 w-14 sm:h-10 sm:w-20 object-contain group-hover:scale-105 transition bg-white"
                                        />
                                    </button>
                                    <button 
                                        onClick={() => onViewLabel(order)}
                                        className="text-[8px] sm:text-[9px] font-bold text-gray-500 hover:text-shop-primary transition cursor-pointer text-center"
                                    >
                                        ดูใบฝากส่ง
                                    </button>
                                </div>
                            ) : null}

                            <button 
                                onClick={() => onViewDetails(order)}
                                className="text-gray-400 hover:text-shop-primary cursor-pointer self-center px-1 shrink-0"
                                aria-label="ดูรายละเอียด"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Action Buttons */}
                    <div className="flex justify-end gap-1.5 sm:gap-2 mt-2 pt-1">
                        <button
                            onClick={() => {
                                const msg = `ສະບາຍດີ, ຕ້ອງການຕິດຕໍ່ສອບຖามກ່ຽວກັບຄຳສັ່ງຊື້ ${orderIdFormatted}`;
                                window.open(`https://wa.me/8562091319983?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 sm:px-3.5 h-8 sm:h-9 text-[10px] sm:text-xs font-black text-gray-600 transition hover:bg-gray-50 hover:text-shop-primary cursor-pointer shrink-0"
                        >
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>ติดต่อร้านค้า</span>
                        </button>

                        <button
                            onClick={() => onViewDetails(order)}
                            className="rounded-xl border border-shop-primary bg-white px-2.5 sm:px-3.5 h-8 sm:h-9 text-[10px] sm:text-xs font-black text-shop-primary transition hover:bg-shop-light cursor-pointer shrink-0"
                        >
                            ดูรายละเอียด
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

function EmptyOrders() {
    return (
        <div className="rounded-2xl border border-dashed border-red-100 bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(51,51,51,0.04)]">
            <p className="text-xl font-black text-shop-text">ຍັງບໍ່ມີຄຳສັ່ງຊື້</p>
            <p className="mt-2 text-sm font-semibold text-gray-500">
                ຫຼັງຈາກກົດສັ່ງຊື້ໃນກະຕ່າ ລາຍການຈະມາສະແດງຢູ່ນີ້
            </p>
            <a
                href="#/products"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-shop-primary px-6 text-sm font-black text-white"
            >
                ໄປໜ້າສິນຄ້າ
            </a>
        </div>
    );
}

const DEMO_ORDERS: Order[] = [
    {
        id: "125",
        storeId: 1,
        storeName: "Pet Shop",
        status: "confirmed",
        createdAt: "2025-06-15T03:23:00.000Z",
        total: 490000,
        items: [
            { productId: 101, name: "Royal Canin Fit 32", quantity: 1, price: 200000 },
            { productId: 102, name: "Me-O Cat Food Salmon", quantity: 1, price: 150000 },
            { productId: 103, name: "Jerhigh Chicken Treat", quantity: 1, price: 140000 },
        ],
        customer: {
            name: "laylay",
            phone: "020 1234 5678",
            province: "ນະຄອນຫຼວງວຽງຈັນ",
            district: "ຈັນທະບູລີ",
            village: "ບ້ານອານຸ",
            address: "ຮ່ອມ 3, ເຮືອນເລກທີ 45",
            note: "ຝາກສົ່ງດ່ວນ",
            shipping: "Anousith Express"
        }
    },
    {
        id: "124",
        storeId: 2,
        storeName: "Happy Fish",
        status: "pending",
        createdAt: "2025-06-14T02:15:00.000Z",
        total: 180000,
        items: [
            { productId: 201, name: "Goldfish Color Enhancing Pellet", quantity: 2, price: 90000 },
        ],
        customer: {
            name: "laylay",
            phone: "020 1234 5678",
            province: "ນະຄອນຫຼວງວຽງຈັນ",
            district: "ໄຊເສດຖາ",
            village: "ບ້ານໂພນທັນ",
            address: "ເຮືອນເລກທີ 12",
            shipping: ""
        }
    },
    {
        id: "123",
        storeId: 3,
        storeName: "Home & Living",
        status: "confirmed",
        createdAt: "2025-06-13T09:45:00.000Z",
        total: 250000,
        items: [
            { productId: 301, name: "Minimalist Ceramic Flower Vase", quantity: 1, price: 250000 },
        ],
        customer: {
            name: "laylay",
            phone: "020 1234 5678",
            province: "ຫຼວງພະບາງ",
            district: "ຫຼວງພະບາງ",
            village: "ບ້ານຊຽງທອງ",
            address: "ໃກ້ວັດຊຽງທອງ",
            shipping: "Kerry Express"
        }
    },
    {
        id: "122",
        storeId: 1,
        storeName: "Pet Shop",
        status: "cancelled",
        createdAt: "2025-06-12T05:30:00.000Z",
        total: 120000,
        items: [
            { productId: 104, name: "Reflective Cat Collar with Bell", quantity: 1, price: 120000 },
        ],
        customer: {
            name: "laylay",
            phone: "020 1234 5678",
            province: "ນະຄອນຫຼວງວຽງຈັນ",
            district: "ສີສັດຕະນາກ",
            village: "ບ້ານທົ່ງກາງ",
            address: "ເຮືອນ 77",
            shipping: ""
        }
    }
];

export function OrderHistoryPage() {
    const localOrders = useOrders();
    const [backendOrders, setBackendOrders] = useState<BackendOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
    const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
    const [selectedShippingOrder, setSelectedShippingOrder] = useState<Order | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setToastMsg("ຄັດລອກເລກພັດສະດຸແລ້ວ: " + text);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const user = getAuthUser();

    useEffect(() => {
        if (!user) {
            setBackendOrders([]);
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        api.myOrders()
            .then((res) => {
                if (isMounted && res.data) {
                    setBackendOrders(res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to load backend orders:", err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const mappedBackendOrders: Order[] = backendOrders.map((bo) => ({
        id: String(bo.id),
        storeId: bo.storeId,
        storeName: bo.store?.name || "RubyStores",
        storeImage: bo.store?.logoUrl,
        status: mapStatus(bo.status),
        createdAt: bo.createdAt,
        total: Number(bo.totalPrice),
        items: (bo.items || []).map((bi) => ({
            productId: bi.productId,
            name: bi.productName,
            quantity: bi.quantity,
            price: Number(bi.price),
            imageUrl: bi.productImageUrl,
        })),
        customer: {
            name: bo.customerName,
            phone: bo.customerPhone,
            address: bo.customerAddress,
            note: bo.note || undefined,
            province: "",
            district: "",
            village: "",
            shipping: "",
        },
    }));

    // Deduplicate local orders that have already been uploaded/synced to the backend
    const combinedOrders = [...mappedBackendOrders];
    
    localOrders.forEach((lo) => {
        // If a backend order exists with the same store, item count, and roughly the same total, skip the local one
        const isDuplicate = mappedBackendOrders.some(
            (bo) => bo.storeId === lo.storeId && bo.items.length === lo.items.length && Math.abs(bo.total - lo.total) < 10
        );
        if (!isDuplicate) {
            combinedOrders.push(lo);
        }
    });

    // Merge DEMO_ORDERS to guarantee the design is fully populated
    DEMO_ORDERS.forEach((demo) => {
        const exists = combinedOrders.some((o) => o.id === demo.id);
        if (!exists) {
            combinedOrders.push(demo);
        }
    });

    const sortedOrders = combinedOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const filteredOrders = sortedOrders.filter((order) => {
        if (activeTab === "all") return true;
        return order.status === activeTab;
    });

    const tabs = [
        { key: "all" as const, label: "ທັງໝົດ" },
        { key: "pending" as const, label: "ລໍຖ້າຢືນຢັນ" },
        { key: "confirmed" as const, label: "ຢືນຢັນແລ້ວ" },
        { key: "cancelled" as const, label: "ຍົກເລີກ" },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-28 pt-[70px] text-shop-text md:pb-12 md:pt-28">
            <HomeHeader activePage="orders" title="ປະຫວັດການສັ່ງຊື້" hideSearch />

            <section className="mx-auto max-w-5xl px-4 pt-3 md:pt-6 md:px-6 lg:px-8">
                <h1 className="hidden text-2xl font-black text-shop-text md:text-3xl">
                    ປະຫວັດການສັ່ງຊື້
                </h1>
                
                <div className="mt-2 md:mt-5 flex border-b border-gray-200 text-sm font-black overflow-x-auto whitespace-nowrap no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative h-11 px-4 min-w-24 transition ${
                                activeTab === tab.key ? "text-shop-primary font-black" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.key ? (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-shop-primary" />
                            ) : null}
                        </button>
                    ))}
                </div>

                <div className="mt-4 md:mt-5 space-y-4">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm font-bold text-gray-500">
                            ກຳລັງໂຫຼດຂໍ້ມູນ...
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                onViewDetails={setSelectedDetailOrder}
                                onViewLabel={setSelectedShippingOrder}
                                onCopy={handleCopy}
                            />
                        ))
                    ) : (
                        <EmptyOrders />
                    )}
                </div>
            </section>

            <MobileBottomNav activePage="orders" />

            {selectedDetailOrder && (
                <OrderDetailModal 
                    order={selectedDetailOrder} 
                    onClose={() => setSelectedDetailOrder(null)} 
                />
            )}

            {selectedShippingOrder && (
                <ShippingLabelModal 
                    order={selectedShippingOrder} 
                    onClose={() => setSelectedShippingOrder(null)} 
                    onCopy={handleCopy}
                />
            )}

            {toastMsg && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-fade-in border border-white/5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{toastMsg}</span>
                </div>
            )}
        </main>
    );
}
