const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugRule = (value: unknown) => {
    if (typeof value !== "string" || slugPattern.test(value)) {
        return null;
    }

    return "slug ຕ້ອງໃຊ້ຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ ຂີດກາງເທົ່ານັ້ນ";
};

export const registerSchema = {
    name: { type: "string", required: true, minLength: 2, maxLength: 80 },
    email: {
        type: "string",
        required: true,
        minLength: 5,
        maxLength: 120,
        format: "email",
    },
    password: { type: "string", required: true, minLength: 8, maxLength: 100 },
} as const;

export const loginSchema = {
    email: {
        type: "string",
        required: true,
        minLength: 5,
        maxLength: 120,
        format: "email",
    },
    password: { type: "string", required: true, minLength: 8, maxLength: 100 },
} as const;

export const createStoreSchema = {
    name: { type: "string", required: true, minLength: 2, maxLength: 100 },
    slug: {
        type: "string",
        required: true,
        minLength: 2,
        maxLength: 80,
        custom: slugRule,
    },
    description: { type: "string", maxLength: 1000 },
    logoUrl: { type: "string", format: "url", maxLength: 500 },
} as const;

export const updateStoreSchema = {
    name: { type: "string", minLength: 2, maxLength: 100 },
    slug: { type: "string", minLength: 2, maxLength: 80, custom: slugRule },
    description: { type: "string", maxLength: 1000 },
    logoUrl: { type: "string", format: "url", maxLength: 500 },
    isActive: { type: "boolean" },
} as const;

export const createCategorySchema = {
    storeId: { type: "number", required: true, min: 1, integer: true },
    name: { type: "string", required: true, minLength: 2, maxLength: 100 },
    slug: {
        type: "string",
        required: true,
        minLength: 2,
        maxLength: 80,
        custom: slugRule,
    },
    iconUrl: { type: "string", format: "url", maxLength: 500 },
} as const;

export const updateCategorySchema = {
    name: { type: "string", minLength: 2, maxLength: 100 },
    slug: { type: "string", minLength: 2, maxLength: 80, custom: slugRule },
    iconUrl: { type: "string", format: "url", maxLength: 500 },
    isActive: { type: "boolean" },
} as const;

export const createProductSchema = {
    storeId: { type: "number", required: true, min: 1, integer: true },
    categoryId: { type: "number", min: 1, integer: true },
    name: { type: "string", required: true, minLength: 2, maxLength: 120 },
    description: { type: "string", maxLength: 2000 },
    price: { type: "number", required: true, min: 0 },
    stock: { type: "number", min: 0, integer: true },
    imageUrl: { type: "string", format: "url", maxLength: 500 },
    isFeatured: { type: "boolean" },
} as const;

export const updateProductSchema = {
    storeId: { type: "number", min: 1, integer: true },
    categoryId: { type: "number", min: 1, integer: true },
    name: { type: "string", minLength: 2, maxLength: 120 },
    description: { type: "string", maxLength: 2000 },
    price: { type: "number", min: 0 },
    stock: { type: "number", min: 0, integer: true },
    imageUrl: { type: "string", format: "url", maxLength: 500 },
    isActive: { type: "boolean" },
    isFeatured: { type: "boolean" },
} as const;

export const createOrderSchema = {
    storeId: { type: "number", required: true, min: 1, integer: true },
    customerName: {
        type: "string",
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    customerPhone: {
        type: "string",
        required: true,
        minLength: 5,
        maxLength: 20,
        format: "phone",
    },
    customerAddress: {
        type: "string",
        required: true,
        minLength: 2,
        maxLength: 500,
    },
    note: { type: "string", maxLength: 1000 },
    deliveryFee: { type: "number", min: 0 },
    orderChannel: {
        type: "enum",
        values: ["WHATSAPP", "MESSENGER", "MANUAL"],
    },
    items: {
        type: "array",
        required: true,
        custom: (value: unknown) => {
            if (!Array.isArray(value) || value.length === 0) {
                return "ລາຍການສິນຄ້າຕ້ອງມີຢ່າງໜ້ອຍ 1 ລາຍການ";
            }

            const invalidItem = value.find((item) => {
                const orderItem = item as {
                    productId?: unknown;
                    quantity?: unknown;
                };

                return (
                    !Number.isInteger(Number(orderItem.productId)) ||
                    Number(orderItem.productId) < 1 ||
                    !Number.isInteger(Number(orderItem.quantity)) ||
                    Number(orderItem.quantity) < 1
                );
            });

            return invalidItem
                ? "ແຕ່ລະລາຍການຕ້ອງມີ productId ແລະ quantity ທີ່ຖືກຕ້ອງ"
                : null;
        },
    },
} as const;

export const updateOrderStatusSchema = {
    status: {
        type: "enum",
        required: true,
        values: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    },
} as const;

export const updateProfileSchema = {
    name: { type: "string", minLength: 2, maxLength: 80 },
    avatarUrl: { type: "string", format: "url", maxLength: 500 },
} as const;
