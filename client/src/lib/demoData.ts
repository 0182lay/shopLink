import type { BackendOrder, Category, Product } from "./api";
import type { Store } from "../types/store";

// ---------------------------------------------------------------------------
// Demo / fallback data for the Admin dashboard.
//
// When the backend (or database) is unreachable, the Admin page falls back to
// this dataset so the UI can still be demoed end-to-end. All values mirror the
// real API shapes (see BackendOrder / Product / Category / Store).
// ---------------------------------------------------------------------------

// Build an ISO date `daysAgo` days back with a fixed-ish hour so the 7-day
// sales chart on the dashboard renders a realistic curve.
const daysAgo = (days: number, hour = 10, minute = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const demoStores: Store[] = [
  {
    id: 1,
    name: "Ruby Pet Shop",
    slug: "ruby-pet-shop",
    description: "ຮ້ານອາຫານສັດ ແລະ ອຸປະກອນສັດລ້ຽງຄົບວົງຈອນ",
    logoUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&auto=format&fit=crop&q=60",
    bannerUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&auto=format&fit=crop&q=60",
    isActive: true,
  },
  {
    id: 2,
    name: "Happy Paws",
    slug: "happy-paws",
    description: "ອຸປະກອນ ແລະ ຂອງຫຼິ້ນສຳລັບໝາ ແລະ ແມວ",
    logoUrl:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=60",
    bannerUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=60",
    isActive: true,
  },
  {
    id: 3,
    name: "Aqua World",
    slug: "aqua-world",
    description: "ຮ້ານປາ ແລະ ອຸປະກອນຕູ້ປາ",
    logoUrl:
      "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=200&auto=format&fit=crop&q=60",
    bannerUrl:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1200&auto=format&fit=crop&q=60",
    isActive: false,
  },
];

export const demoCategories: Category[] = [
  { id: 1, storeId: 1, name: "ອາຫານແມວ", slug: "cat-food", isActive: true, createdAt: daysAgo(120) },
  { id: 2, storeId: 1, name: "ອາຫານໝາ", slug: "dog-food", isActive: true, createdAt: daysAgo(120) },
  { id: 3, storeId: 1, name: "ຂອງຫຼິ້ນ", slug: "toys", isActive: true, createdAt: daysAgo(90) },
  { id: 4, storeId: 2, name: "ອຸປະກອນອາບນ້ຳ", slug: "grooming", isActive: true, createdAt: daysAgo(60) },
  { id: 5, storeId: 3, name: "ອຸປະກອນຕູ້ປາ", slug: "aquarium", isActive: false, createdAt: daysAgo(30) },
];

export const demoProducts: Product[] = [
  {
    id: 1,
    storeId: 1,
    categoryId: 1,
    name: "Royal Canin Kitten 2kg",
    description: "ອາຫານແມວນ້ອຍ ສູດຄົບຖ້ວນ",
    price: 320000,
    stock: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 2,
    storeId: 1,
    categoryId: 1,
    name: "Me-O Adult 1.1kg",
    description: "ອາຫານແມວໂຕເຕັມໄວ ລົດປາທູນາ",
    price: 85000,
    stock: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1608454367599-c11394b46c21?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: false,
  },
  {
    id: 3,
    storeId: 1,
    categoryId: 2,
    name: "Pedigree Adult 3kg",
    description: "ອາຫານໝາໂຕເຕັມໄວ ລົດຊີ້ນງົວ",
    price: 210000,
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 4,
    storeId: 1,
    categoryId: 3,
    name: "JerHigh Stick 500g",
    description: "ຂະໜົມໝາ ລົດຊີ້ນໄກ່",
    price: 65000,
    stock: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: false,
  },
  {
    id: 5,
    storeId: 2,
    categoryId: 3,
    name: "ຂອງຫຼິ້ນໝາ ຢາງກັດ",
    description: "ຂອງຫຼິ້ນຢາງທົນທານ ສຳລັບໝາ",
    price: 45000,
    stock: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: false,
  },
  {
    id: 6,
    storeId: 2,
    categoryId: 4,
    name: "ແຊມພູແມວ Anti-Flea 300ml",
    description: "ແຊມພູກຳຈັດເຫັບໝັດ ອ່ອນໂຍນ",
    price: 78000,
    stock: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 7,
    storeId: 3,
    categoryId: 5,
    name: "ປໍ້າອາກາດຕູ້ປາ 5W",
    description: "ປໍ້າອາກາດ ສຽງງຽບ ປະຢັດໄຟ",
    price: 120000,
    stock: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&auto=format&fit=crop&q=60",
    isActive: false,
    isFeatured: false,
  },
  {
    id: 8,
    storeId: 1,
    categoryId: 2,
    name: "SmartHeart Puppy 1.5kg",
    description: "ອາຫານລູກໝາ ບຳລຸງຂົນ",
    price: 95000,
    stock: 33,
    imageUrl:
      "https://images.unsplash.com/photo-1585846888147-3fe14c130048?w=400&auto=format&fit=crop&q=60",
    isActive: true,
    isFeatured: false,
  },
];

const storeById = (id: number): Store =>
  demoStores.find((store) => store.id === id) ?? demoStores[0];

type DemoOrderSeed = {
  id: number;
  status: BackendOrder["status"];
  channel: BackendOrder["orderChannel"];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note?: string | null;
  deliveryFee: number;
  createdAt: string;
  storeId: number;
  lines: Array<{ productId: number; quantity: number }>;
};

const orderSeeds: DemoOrderSeed[] = [
  {
    id: 1042,
    status: "PENDING",
    channel: "WHATSAPP",
    customerName: "ນາງ ດາວອນ",
    customerPhone: "02055512345",
    customerAddress: "ບ້ານ ໜອງບອນ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ",
    note: "ຝາກໄວ້ຢູ່ຮ້ານຄ້າໜ້າບ້ານ",
    deliveryFee: 15000,
    createdAt: daysAgo(0, 9, 15),
    storeId: 1,
    lines: [
      { productId: 1, quantity: 1 },
      { productId: 4, quantity: 2 },
    ],
  },
  {
    id: 1041,
    status: "PENDING",
    channel: "MESSENGER",
    customerName: "ທ້າວ ສົມພອນ",
    customerPhone: "02077788899",
    customerAddress: "ບ້ານ ໂພນທັນ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 15000,
    createdAt: daysAgo(0, 11, 40),
    storeId: 1,
    lines: [{ productId: 3, quantity: 1 }],
  },
  {
    id: 1039,
    status: "CONFIRMED",
    channel: "WHATSAPP",
    customerName: "ນາງ ວັນນະສອນ",
    customerPhone: "02099911122",
    customerAddress: "ບ້ານ ດົງປ່າແລນ, ເມືອງ ສີໂຄດຕະບອງ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 20000,
    createdAt: daysAgo(1, 14, 5),
    storeId: 1,
    lines: [
      { productId: 2, quantity: 3 },
      { productId: 6, quantity: 1 },
    ],
  },
  {
    id: 1037,
    status: "SHIPPING",
    channel: "MANUAL",
    customerName: "ທ້າວ ໄຊຍະ",
    customerPhone: "02033344455",
    customerAddress: "ບ້ານ ຫາຍໂສກ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 15000,
    createdAt: daysAgo(2, 16, 20),
    storeId: 2,
    lines: [{ productId: 5, quantity: 2 }],
  },
  {
    id: 1035,
    status: "COMPLETED",
    channel: "WHATSAPP",
    customerName: "ນາງ ພູທອນ",
    customerPhone: "02066677788",
    customerAddress: "ບ້ານ ໂນນສະຫວ່າງ, ເມືອງ ໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 25000,
    createdAt: daysAgo(3, 10, 0),
    storeId: 1,
    lines: [
      { productId: 1, quantity: 2 },
      { productId: 8, quantity: 1 },
    ],
  },
  {
    id: 1032,
    status: "COMPLETED",
    channel: "MESSENGER",
    customerName: "ທ້າວ ຄຳໃບ",
    customerPhone: "02011122233",
    customerAddress: "ບ້ານ ຈອມມະນີ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 15000,
    createdAt: daysAgo(4, 13, 30),
    storeId: 2,
    lines: [{ productId: 6, quantity: 2 }],
  },
  {
    id: 1028,
    status: "COMPLETED",
    channel: "WHATSAPP",
    customerName: "ນາງ ສີດາ",
    customerPhone: "02088899900",
    customerAddress: "ບ້ານ ໜອງໜ່ຽງ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ",
    deliveryFee: 20000,
    createdAt: daysAgo(5, 9, 45),
    storeId: 1,
    lines: [
      { productId: 3, quantity: 1 },
      { productId: 2, quantity: 2 },
    ],
  },
  {
    id: 1021,
    status: "CANCELLED",
    channel: "MANUAL",
    customerName: "ທ້າວ ບຸນມີ",
    customerPhone: "02044455566",
    customerAddress: "ບ້ານ ໂພນສະຫວ່າງ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ",
    note: "ລູກຄ້າຍົກເລີກເອງ",
    deliveryFee: 15000,
    createdAt: daysAgo(6, 15, 10),
    storeId: 1,
    lines: [{ productId: 4, quantity: 1 }],
  },
];

const buildOrder = (seed: DemoOrderSeed): BackendOrder => {
  const items = seed.lines.map((line, index) => {
    const product = demoProducts.find((p) => p.id === line.productId) ?? demoProducts[0];
    const price = Number(product.price);
    return {
      id: seed.id * 100 + index,
      orderId: seed.id,
      productId: product.id,
      productName: product.name,
      productImageUrl: product.imageUrl ?? null,
      price,
      quantity: line.quantity,
      subtotal: price * line.quantity,
    };
  });

  const itemsTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return {
    id: seed.id,
    storeId: seed.storeId,
    userId: null,
    customerName: seed.customerName,
    customerPhone: seed.customerPhone,
    customerAddress: seed.customerAddress,
    note: seed.note ?? null,
    totalPrice: itemsTotal + seed.deliveryFee,
    deliveryFee: seed.deliveryFee,
    status: seed.status,
    orderChannel: seed.channel,
    createdAt: seed.createdAt,
    store: storeById(seed.storeId),
    items,
  };
};

export const demoOrders: BackendOrder[] = orderSeeds.map(buildOrder);

export type AdminDemoData = {
  products: Product[];
  stores: Store[];
  categories: Category[];
  orders: BackendOrder[];
};

export const adminDemoData: AdminDemoData = {
  products: demoProducts,
  stores: demoStores,
  categories: demoCategories,
  orders: demoOrders,
};
