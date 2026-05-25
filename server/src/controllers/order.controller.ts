import { Request, Response } from "express";
import { OrderChannel, OrderStatus } from "../generated/prisma/enums";
import { orderService } from "../services/order.service";

const parseId = (id: string) => Number.parseInt(id, 10);
const orderStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
];

// 1. ຮັບ request ເພື່ອດຶງ order ທັງໝົດ
// 2. ເອີ້ນ service ໃຫ້ດຶງ order ພ້ອມ items ແລະ store
// 3. ສົ່ງລາຍການ order ກັບໄປໃຫ້ admin
export const getOrders = async (_req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
        success: true,
        data: orders,
    });
};

// 1. ຮັບ storeId ຈາກ URL
// 2. ກວດວ່າ storeId ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ order ຂອງຮ້ານນັ້ນກັບໄປໃຫ້ admin
export const getOrdersByStoreId = async (
    req: Request<{ storeId: string }>,
    res: Response,
) => {
    const storeId = parseId(req.params.storeId);

    if (Number.isNaN(storeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid store id",
        });
    }

    const orders = await orderService.getOrdersByStoreId(storeId);

    return res.status(200).json({
        success: true,
        data: orders,
    });
};

// 1. ຮັບຂໍ້ມູນ checkout ຈາກ request body
// 2. ກວດວ່າຂໍ້ມູນລູກຄ້າ ແລະ items ຖືກສົ່ງມາຄົບຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອສ້າງ order ແລະສົ່ງ summary ກັບ
export const createOrder = async (req: Request, res: Response) => {
    const {
        storeId,
        customerName,
        customerPhone,
        customerAddress,
        note,
        deliveryFee,
        orderChannel,
        items,
    } = req.body;
    const parsedStoreId = Number(storeId);

    if (
        !parsedStoreId ||
        !customerName ||
        !customerPhone ||
        !customerAddress ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Store, customer information and items are required",
        });
    }

    const result = await orderService.createOrder({
        storeId: parsedStoreId,
        userId: req.user?.id,
        customerName,
        customerPhone,
        customerAddress,
        note,
        deliveryFee: deliveryFee === undefined ? undefined : Number(deliveryFee),
        orderChannel: orderChannel as OrderChannel | undefined,
        items: items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
        })),
    });

    return res.status(201).json({
        success: true,
        data: result.order,
        orderSummary: result.orderSummary,
        messageLinks: result.messageLinks,
    });
};

// 1. ຮັບ user ຈາກ token ຫຼັງ login
// 2. ເອີ້ນ service ເພື່ອດຶງ order ຂອງ user ຄົນນັ້ນ
// 3. ສົ່ງປະຫວັດການສັ່ງຊື້ກັບໄປໃຫ້ client
export const getMyOrders = async (req: Request, res: Response) => {
    const orders = await orderService.getMyOrders(req.user!.id);

    return res.status(200).json({
        success: true,
        data: orders,
    });
};

// 1. ຮັບ id ຂອງ order ຈາກ URL
// 2. ກວດວ່າ id ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ order ພ້ອມ items ແລະ summary ກັບໄປໃຫ້ client
export const getOrderById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order id",
        });
    }

    const result = await orderService.getOrderById(id);

    return res.status(200).json({
        success: true,
        data: result.order,
        orderSummary: result.orderSummary,
        messageLinks: result.messageLinks,
    });
};

// 1. ຮັບ id ຂອງ order ຈາກ URL ແລະ status ໃໝ່ຈາກ body
// 2. ກວດວ່າ id ແລະ status ຖືກຕ້ອງຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອ update status ແລະຈັດການ stock
export const updateOrderStatus = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);
    const status = req.body.status as OrderStatus;

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order id",
        });
    }

    if (!orderStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status",
        });
    }

    const result = await orderService.updateOrderStatus(id, status);

    return res.status(200).json({
        success: true,
        data: result.order,
        orderSummary: result.orderSummary,
        messageLinks: result.messageLinks,
    });
};
