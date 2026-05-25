const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugRule = (value: unknown) => {
    if (typeof value !== "string" || slugPattern.test(value)) {
        return null;
    }

    return "slug must use lowercase letters, numbers and hyphens only";
};

export const registerSchema = {
    name: { type: "string", required: true, minLength: 2 },
    email: { type: "string", required: true, minLength: 5 },
    password: { type: "string", required: true, minLength: 8 },
} as const;

export const loginSchema = {
    email: { type: "string", required: true, minLength: 5 },
    password: { type: "string", required: true, minLength: 8 },
} as const;

export const createStoreSchema = {
    name: { type: "string", required: true, minLength: 2 },
    slug: { type: "string", required: true, minLength: 2, custom: slugRule },
    description: { type: "string" },
    logoUrl: { type: "string" },
} as const;

export const updateStoreSchema = {
    name: { type: "string", minLength: 2 },
    slug: { type: "string", minLength: 2, custom: slugRule },
    description: { type: "string" },
    logoUrl: { type: "string" },
    isActive: { type: "boolean" },
} as const;

export const createCategorySchema = {
    storeId: { type: "number", required: true, min: 1 },
    name: { type: "string", required: true, minLength: 2 },
    slug: { type: "string", required: true, minLength: 2, custom: slugRule },
    iconUrl: { type: "string" },
} as const;

export const updateCategorySchema = {
    name: { type: "string", minLength: 2 },
    slug: { type: "string", minLength: 2, custom: slugRule },
    iconUrl: { type: "string" },
    isActive: { type: "boolean" },
} as const;

export const createProductSchema = {
    storeId: { type: "number", required: true, min: 1 },
    categoryId: { type: "number", min: 1 },
    name: { type: "string", required: true, minLength: 2 },
    description: { type: "string" },
    price: { type: "number", required: true, min: 0 },
    stock: { type: "number", min: 0 },
    imageUrl: { type: "string" },
} as const;

export const updateProductSchema = {
    storeId: { type: "number", min: 1 },
    categoryId: { type: "number", min: 1 },
    name: { type: "string", minLength: 2 },
    description: { type: "string" },
    price: { type: "number", min: 0 },
    stock: { type: "number", min: 0 },
    imageUrl: { type: "string" },
    isActive: { type: "boolean" },
} as const;

export const createOrderSchema = {
    storeId: { type: "number", required: true, min: 1 },
    customerName: { type: "string", required: true, minLength: 2 },
    customerPhone: { type: "string", required: true, minLength: 5 },
    customerAddress: { type: "string", required: true, minLength: 2 },
    note: { type: "string" },
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
                return "items must contain at least one product";
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
                ? "each item must have a valid productId and quantity"
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
    name: { type: "string", minLength: 2 },
    avatarUrl: { type: "string" },
} as const;
