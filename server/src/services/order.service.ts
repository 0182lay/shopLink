import { prisma } from "../config/prisma";
import { OrderChannel, OrderStatus } from "../generated/prisma/enums";
import { HttpError } from "../utils/http-error";

type CreateOrderItemData = {
    productId: number;
    quantity: number;
};

type CreateOrderData = {
    storeId: number;
    userId?: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    note?: string;
    deliveryFee?: number;
    orderChannel?: OrderChannel;
    items: CreateOrderItemData[];
};

const buildOrderSummary = (order: Awaited<ReturnType<typeof getOrderById>>) => {
    if (!order) {
        return "";
    }

    const itemLines = order.items
        .map(
            (item) =>
                `- ${item.productName} x${item.quantity} = ${item.subtotal}`,
        )
        .join("\n");

    return [
        `Order #${order.id}`,
        `Customer: ${order.customerName}`,
        `Phone: ${order.customerPhone}`,
        `Address: ${order.customerAddress}`,
        order.note ? `Note: ${order.note}` : undefined,
        "",
        "Items:",
        itemLines,
        "",
        `Delivery fee: ${order.deliveryFee}`,
        `Total: ${order.totalPrice}`,
        `Status: ${order.status}`,
    ]
        .filter(Boolean)
        .join("\n");
};

const getOrderById = (id: number) => {
    return prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            items: true,
            store: true,
        },
    });
};

export const orderService = {
    // 1. ດຶງ order ທັງໝົດຈາກ database
    // 2. ດຶງ items ແລະ store ມາພ້ອມກັນ
    // 3. ຈັດລຽງ order ໃໝ່ສຸດໄວ້ເທິງໃຫ້ admin ເບິ່ງງ່າຍ
    getAllOrders() {
        return prisma.order.findMany({
            include: {
                items: true,
                store: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ storeId ຈາກ controller
    // 2. ດຶງ order ຂອງຮ້ານນັ້ນພ້ອມ items
    // 3. ໃຊ້ໃນໜ້າ admin ເພື່ອເບິ່ງ order ແຍກຕາມຮ້ານ
    getOrdersByStoreId(storeId: number) {
        return prisma.order.findMany({
            where: {
                storeId,
            },
            include: {
                items: true,
                store: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບຂໍ້ມູນ checkout ຈາກ controller
    // 2. ກວດຮ້ານ, product ແລະ stock ກ່ອນສ້າງ order
    // 3. ຄຳນວນ total ໃນ backend ແລ້ວບັນທຶກ order ກັບ order_items
    async createOrder(data: CreateOrderData) {
        const store = await prisma.store.findFirst({
            where: {
                id: data.storeId,
                deletedAt: null,
                isActive: true,
            },
        });

        if (!store) {
            throw new HttpError(404, "Store not found");
        }

        const productIds = data.items.map((item) => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
                storeId: data.storeId,
                deletedAt: null,
                isActive: true,
            },
        });

        if (products.length !== productIds.length) {
            throw new HttpError(400, "Some products are not available");
        }

        const orderItems = data.items.map((item) => {
            const product = products.find(
                (product) => product.id === item.productId,
            );

            if (!product) {
                throw new HttpError(400, "Product not found");
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new HttpError(400, "Product quantity must be positive");
            }

            if (product.stock < item.quantity) {
                throw new HttpError(
                    400,
                    `Not enough stock for ${product.name}`,
                );
            }

            const price = Number(product.price);
            const subtotal = price * item.quantity;

            return {
                productId: product.id,
                productName: product.name,
                productImageUrl: product.imageUrl,
                price,
                quantity: item.quantity,
                subtotal,
            };
        });

        const deliveryFee = data.deliveryFee ?? 0;
        const totalPrice =
            orderItems.reduce((total, item) => total + item.subtotal, 0) +
            deliveryFee;

        const order = await prisma.order.create({
            data: {
                storeId: data.storeId,
                userId: data.userId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerAddress: data.customerAddress,
                note: data.note,
                deliveryFee,
                totalPrice,
                orderChannel: data.orderChannel ?? "WHATSAPP",
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
                store: true,
            },
        });

        return {
            order,
            orderSummary: buildOrderSummary(order),
        };
    },

    // 1. ຮັບ id ຂອງ order ຈາກ controller
    // 2. ດຶງ order ພ້ອມ items ແລະ store
    // 3. ສ້າງ summary ເພື່ອໃຫ້ frontend ໃຊ້ສົ່ງ WhatsApp/Messenger
    async getOrderById(id: number) {
        const order = await getOrderById(id);

        if (!order) {
            throw new HttpError(404, "Order not found");
        }

        return {
            order,
            orderSummary: buildOrderSummary(order),
        };
    },

    // 1. ຮັບ userId ຈາກ token ຂອງຜູ້ login
    // 2. ດຶງ order ທີ່ຜູກກັບ user ຄົນນັ້ນ
    // 3. ໃຊ້ເປັນປະຫວັດການສັ່ງຊື້ຂອງລູກຄ້າ
    getMyOrders(userId: number) {
        return prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                items: true,
                store: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ id ຂອງ order ແລະ status ໃໝ່ຈາກ controller
    // 2. ຖ້າ confirm order ຈະກວດ stock ແລະຕັດ stock ໃນ transaction
    // 3. ຖ້າ cancel order ທີ່ confirm ແລ້ວ ຈະຄືນ stock ກັບ
    async updateOrderStatus(id: number, status: OrderStatus) {
        const order = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                items: true,
                store: true,
            },
        });

        if (!order) {
            throw new HttpError(404, "Order not found");
        }

        if (order.status === status) {
            return {
                order,
                orderSummary: buildOrderSummary(order),
            };
        }

        const shouldDecreaseStock =
            order.status !== "CONFIRMED" && status === "CONFIRMED";
        const shouldRestoreStock =
            order.status === "CONFIRMED" && status === "CANCELLED";

        const updatedOrder = await prisma.$transaction(async (tx) => {
            if (shouldDecreaseStock) {
                for (const item of order.items) {
                    const product = await tx.product.findUnique({
                        where: {
                            id: item.productId,
                        },
                    });

                    if (!product || product.stock < item.quantity) {
                        throw new HttpError(
                            400,
                            `Not enough stock for ${item.productName}`,
                        );
                    }

                    await tx.product.update({
                        where: {
                            id: item.productId,
                        },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }

            if (shouldRestoreStock) {
                for (const item of order.items) {
                    await tx.product.update({
                        where: {
                            id: item.productId,
                        },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }

            return tx.order.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
                include: {
                    items: true,
                    store: true,
                },
            });
        });

        return {
            order: updatedOrder,
            orderSummary: buildOrderSummary(updatedOrder),
        };
    },
};
